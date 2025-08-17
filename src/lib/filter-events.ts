import dayjs from "dayjs";
import { type AppConfig } from "~/app/loadConfig";
import { type Event } from "~/components/event-list";

export default function filterEvents(
  events: Event[],
  config: AppConfig,
): Event[] {
  return events.filter(
    (event) =>
      !event.private &&
      (config.calendar.timeout !== 0
        ? event.times.some((time) =>
            dayjs(time.end).isAfter(
              dayjs().subtract(config.calendar.timeout, "minute"),
            ),
          )
        : true),
  );
}
