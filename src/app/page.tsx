import EventList from "~/components/event-list";
import RefreshComponent from "~/components/refresh-component";
import dayjs from "dayjs";
import { getDebugDateFromSearchParams, type SearchParams } from "~/lib/debug-date";
import filterEvents from "~/lib/filter-events";
import getCalendar from "~/lib/get-calendar";
import Header from "./header";
import { loadConfig } from "./loadConfig";

export const dynamic = "force-dynamic";

export default async function HomePage(props: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const debugNow = getDebugDateFromSearchParams(searchParams);

  const config = await loadConfig();
  const now = debugNow ?? dayjs();
  const calendar = await getCalendar(config, now);
  const events = filterEvents(calendar.events, config, now);

  if (calendar.error) {
    console.error("Error fetching calendar:", calendar.error);
  }

  return (
    <>
      <Header config={config} referenceDateISO={now.toISOString()} />
      <main className="relative flex-1 flex flex-col bg-zinc-200 p-5 min-h-0">
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
                referenceDateISO={now.toISOString()}
              />
            ) : (
              <p className="text-center text-2xl">
                Keine Veranstaltungen heute
              </p>
            )}
          </>
        )}
        <p className="my-auto mb-0 text-right font-extralight text-zinc-800">
          Aktualisiert: {calendar.time.toLocaleString("de")}
        </p>
      </main>
    </>
  );
}
