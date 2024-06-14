"use server";

import { XMLParser } from "fast-xml-parser";
import { type AppConfig } from "~/app/loadConfig";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
import { type Event } from "~/components/event-list";
import ical from "node-ical";

const responseSchema = z.object({
  href: z.string(),
  propstat: z.object({
    prop: z.object({
      getetag: z.string(),
      "calendar-data": z.string(),
    }),
    status: z.string(),
  }),
});

const WebDAVCalendarResponseSchema = z.object({
  multistatus: z
    .object({
      response: z.union([responseSchema, z.array(responseSchema)]),
    })
    .or(z.literal("")),
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
                <x0:prop xmlns:x0="DAV:"><x0:getetag/><x1:calendar-data/></x0:prop> \
                <x1:filter><x1:comp-filter name="VCALENDAR"><x1:comp-filter name="VEVENT"> \
                <x1:time-range start="${dayStartFormat}" end="${dayEndFormat}"/> \
                </x1:comp-filter></x1:comp-filter></x1:filter></x1:calendar-query> \
                `,
      });

      const text = await calendarResponse.text();

      return parseCalendar(text, calendar.name);
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
    events: result.flatMap((r) => r.events),
  };
}

function parseCalendar(text: string, calendarName: string) {
  const parser = new XMLParser({ removeNSPrefix: true });
  const doc = WebDAVCalendarResponseSchema.safeParse(parser.parse(text));

  if (doc.success) {
    if (doc.data.multistatus === "") {
      return {
        time: new Date(),
        events: [] as Event[],
      };
    }

    const response = doc.data.multistatus.response;

    if (Array.isArray(response)) {
      return {
        time: new Date(),
        events: response.map((r) => parseResponse(r, calendarName)),
      };
    }

    return {
      time: new Date(),
      events: [parseResponse(response, calendarName)],
    };
  }

  return {
    time: new Date(),
    events: [] as Event[],
    error: "Failed to parse response: " + JSON.stringify(doc.error.errors),
  };
}

function parseResponse(
  response: z.infer<typeof responseSchema>,
  calendarName: string,
): Event {
  const data = ical.sync.parseICS(response.propstat.prop["calendar-data"]);
  const event = Object.entries(data)
    .filter(([_, value]) => value.type === "VEVENT")
    .map(([key, value]) => {
      const ical = value as ical.VEvent;

      return {
        id: key,
        title: ical.summary,
        times: [
          {
            start: dayjs(ical.start).toDate(),
            end: dayjs(ical.end).toDate(),
          },
        ],
        description: calendarName,
        level: ical.location,
      } as Event;
    })[0];

  return event!;
}
