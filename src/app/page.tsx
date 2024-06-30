import EventList from "~/components/event-list";
import RefreshComponent from "~/components/refresh-component";
import filterEvents from "~/lib/filter-events";
import getCalendar from "~/lib/get-calendar";
import Header from "./header";
import { loadConfig } from "./loadConfig";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const config = await loadConfig();
  const calendar = await getCalendar(config);
  const events = filterEvents(calendar.events, config);

  return (
    <>
      <Header config={config} />
      <main className="relative row-span-9 flex max-h-full flex-col bg-zinc-200 p-5">
        <RefreshComponent refreshInterval={config.calendar.refreshInterval} />
        {calendar.error ? (
          <p className="text-red-500">{calendar.error}</p>
        ) : (
          <>
            {events.length > 0 ? (
              <EventList
                events={events}
                className="max-h-full flex-grow overflow-y-scroll"
                config={config}
              />
            ) : (
              <p className="text-center text-2xl">
                Keine Veranstaltungen heute
              </p>
            )}
          </>
        )}
        <p className="my-auto mb-0 text-right font-extralight text-zinc-800">
          Aktualisiert: {calendar.time.toLocaleString()}
        </p>
      </main>
    </>
  );
}
