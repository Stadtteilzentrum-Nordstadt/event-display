import { type AppConfig } from "~/app/loadConfig";
import { type Event } from "~/components/event-list";

export default function filterEvents(
  events: Event[],
  config: AppConfig,
): Event[] {
  return events.filter(
    (event) =>
      !config.calendar.ignoreKeywords.some((keyword) =>
        event.title.includes(keyword),
      ) &&
      (config.calendar.timeout !== 0
        ? event.times.some(
            (time) =>
              time.end.getTime() > Date.now() - config.calendar.timeout * 1000,
          )
        : true),
  );
}
