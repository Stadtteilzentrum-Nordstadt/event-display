import { type NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { loadConfig } from "~/app/loadConfig";
import getCalendar from "~/lib/get-calendar";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const dynamic = "force-dynamic";

const DATE_FORMAT = "YYYY-MM-DD";

export async function GET(request: NextRequest) {
  const config = await loadConfig();
  const timeZone = config.calendar.timeZone;

  const dateParam = request.nextUrl.searchParams.get("date");

  let day = dayjs().tz(timeZone);
  if (dateParam !== null) {
    const parsed = dayjs.tz(dateParam, DATE_FORMAT, timeZone);
    if (!parsed.isValid()) {
      return NextResponse.json(
        { error: `Invalid date. Expected format: ${DATE_FORMAT}` },
        { status: 400 },
      );
    }
    day = parsed;
  }

  const calendar = await getCalendar(config, day);

  if (calendar.error) {
    return NextResponse.json({ error: calendar.error }, { status: 502 });
  }

  // Only public, non-all-day events are relevant here; the timeout filter
  // is a display concern and is intentionally not applied.
  const events = calendar.events.filter(
    (event) => !event.private && !event.allDay,
  );
  const times = events.flatMap((event) => event.times);

  const first = times.reduce<Date | null>(
    (min, t) => (min === null || t.start < min ? t.start : min),
    null,
  );
  const last = times.reduce<Date | null>(
    (max, t) => (max === null || t.end > max ? t.end : max),
    null,
  );

  return NextResponse.json({
    date: day.format(DATE_FORMAT),
    timeZone,
    first: first?.toISOString() ?? null,
    last: last?.toISOString() ?? null,
    firstLocal: first ? dayjs(first).tz(timeZone).format("HH:mm") : null,
    lastLocal: last ? dayjs(last).tz(timeZone).format("HH:mm") : null,
    eventCount: events.length,
  });
}
