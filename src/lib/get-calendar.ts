"use server";

import { XMLParser } from "fast-xml-parser";
import { type AppConfig } from "~/app/loadConfig";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
import { type Event } from "~/components/event-list";
import ical from "node-ical";

const propSchema = z.object({
  prop: z.object({
    "calendar-data": z.string().optional(),
  }),
  status: z.string(),
});

const responseSchema = z.object({
  href: z.string(),
  propstat: propSchema.or(z.array(propSchema)),
});

const WebDAVCalendarResponseSchema = z.object({
  multistatus: z
    .object({
      response: responseSchema.or(z.array(responseSchema)),
    })
    .or(z.literal(""))
    .optional(),
});

export type WebDAVCalendarResponse = z.infer<
  typeof WebDAVCalendarResponseSchema
>;

dayjs.extend(utc);
dayjs.extend(timezone);

export type RequestedCalendarResponse = {
  time: Date;
  events: Event[];
  error?: string;
};

export default async function getCalendar(
  config: AppConfig,
): Promise<RequestedCalendarResponse> {
  const timeZone = config.calendar.timeZone;

  const dayStart = dayjs().tz(timeZone).hour(0).minute(0).second(0);
  const dayEnd = dayStart.add(1, "day");

  const dayStartFormat = dayStart.format("YYYYMMDDTHHmmss[Z]");
  const dayEndFormat = dayEnd.format("YYYYMMDDTHHmmss[Z]");

  // request and parse all calenders
  const result = await Promise.all(
    config.calendar.calendars.map(async (calendar) => {
      const calendarResponse = await fetch(calendar.url, {
        method: "REPORT",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${config.calendar.auth.username}:${config.calendar.auth.password}`,
          ).toString("base64")}`,
          "Content-Type": "application/xml",
          Accept: "application/json",
          Depth: "1",
        },
        body: `\
                <x1:calendar-query xmlns:x1="urn:ietf:params:xml:ns:caldav"> \
                <x0:prop xmlns:x0="DAV:"><x0:getcontenttype/><x0:getetag/><x0:resourcetype/><x0:displayname/><x0:owner/><x0:resourcetype/> \
                <x0:sync-token/><x0:current-user-privilege-set/><x0:getcontenttype/><x0:getetag/><x0:resourcetype/><x1:calendar-data/> \
                </x0:prop><x1:filter><x1:comp-filter name="VCALENDAR"><x1:comp-filter name="VEVENT"> \
                <x1:time-range start="${dayStartFormat}" end="${dayEndFormat}"/> \
                </x1:comp-filter></x1:comp-filter></x1:filter></x1:calendar-query>
                `,
      });

      const text = await calendarResponse.text();

      console.log(text);

      return parseCalendar(text, config, calendar);
    }),
  );

  if (result.some((r) => r.error)) {
    return {
      time: new Date(),
      events: [],
      error: result.map((r) => r.error).join("\n"),
    };
  }

  return {
    time: new Date(),
    events: result
      .flatMap((r) => r.events.filter((e) => e != null))
      .reduce<Event[]>((acc, e) => {
        const event = e!;

        const timeAccumilation = acc.find(
          (e) => e.description === event.description && e.title === event.title,
        );

        const roomAccumilation = acc.find(
          (event2) =>
            event2.title === event.title &&
            event2.times.every(({ start, end }) => {
              return event.times.some(
                ({ start: start2, end: end2 }) =>
                  dayjs(start).isSame(dayjs(start2), "minute") &&
                  dayjs(end).isSame(dayjs(end2), "minute"),
              );
            }),
        );

        if (roomAccumilation) {
          roomAccumilation.description = `${roomAccumilation.description}, ${event.description}`;
        }

        if (timeAccumilation) {
          timeAccumilation.times.push(...event.times);
        }

        if (!timeAccumilation && !roomAccumilation) {
          acc.push(event);
        }

        return acc;
      }, []),
  };
}

function parseCalendar(
  text: string,
  config: AppConfig,
  calendarConfig: AppConfig["calendar"]["calendars"][0],
) {
  const parser = new XMLParser({ removeNSPrefix: true });
  const doc = WebDAVCalendarResponseSchema.safeParse(parser.parse(text));

  if (doc.success) {
    if (doc.data.multistatus === "") {
      return {
        time: new Date(),
        events: [] as Event[],
      };
    }

    const response = doc.data.multistatus?.response ?? [];

    if (Array.isArray(response)) {
      return {
        time: new Date(),
        events: response.map((r) => parseResponse(r, config, calendarConfig)),
      };
    }

    return {
      time: new Date(),
      events: [parseResponse(response, config, calendarConfig)],
    };
  }

  console.log(doc.error);

  return {
    time: new Date(),
    events: [] as Event[],
    error: "Failed to parse response: " + JSON.stringify(doc.error.errors),
  };
}

function parseResponse(
  response: z.infer<typeof responseSchema>,
  config: AppConfig,
  calendarConfig: AppConfig["calendar"]["calendars"][0],
): Event | undefined {
  const propstat = Array.isArray(response.propstat)
    ? response.propstat.find((ps) => ps.status.includes("200 OK"))
    : response.propstat;

  if (!propstat?.status.includes("200 OK")) {
    return undefined;
  }

  const data = ical.sync.parseICS(propstat.prop["calendar-data"]!);

  const event = Object.entries(data)
    .filter(([_, value]) => value.type === "VEVENT")
    .map(([key, value]) => {
      const ical = value as ical.VEvent;

      const start = dayjs(ical.start);
      const end = dayjs(ical.end);

      return {
        id: key,
        title: ical.summary ?? "Unbenannte Veranstaltung",
        times: [
          {
            start: start.toDate(),
            end: end.toDate(),
          },
        ],
        allDay: start.isSame(end.subtract(1, "day")),
        description: !calendarConfig.hideName ? calendarConfig.name : undefined,
        level: ical.location ?? calendarConfig.location ?? "",
        color: calendarConfig.color,
        openEnd: config.calendar.openEndKeywords.some(
          (keyword) =>
            ical.description?.includes(keyword) ||
            ical.summary?.includes(keyword),
        ),
        status: ical.status,
      } as Event;
    })[0];

  return event!;
}
