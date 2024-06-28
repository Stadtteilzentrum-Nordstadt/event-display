"use server";

import EventList, { Event } from "~/components/event-list";
import RefreshComponent from "~/components/refresh-component";
import filterEvents from "~/lib/filter-events";
import getCalendar from "~/lib/get-calendar";
import Header from "./header";
import { loadConfig } from "./loadConfig";

export default async function HomePage() {
  const config = await loadConfig();
  const calendar = await getCalendar(config);

  return (
    <>
      <Header config={config} />
      <main className="relative row-span-9 flex max-h-full flex-col bg-zinc-200 p-5">
        <RefreshComponent refreshInterval={config.calendar.refreshInterval} />
        {calendar.error ? (
          <p className="text-red-500">{calendar.error}</p>
        ) : (
          <EventList
            events={filterEvents(calendar.events, config)}
            className="max-h-full flex-grow overflow-y-scroll"
            config={config}
          />
        )}
        <p className="my-auto text-right font-extralight text-zinc-800">
          Aktualisiert: {calendar.time.toLocaleString()}
        </p>
      </main>
    </>
  );
}

function testData() {
  return {
    time: new Date(),
    events: Array.from(Array(15).keys()).map((_, i) => ({
      id: i.toString(),
      title: `Event ${i}`,
      description: `Room ${i}`,
      level: `${i}. OG`,
      times: [{ start: new Date(), end: new Date() }],
    })) as Event[],
    error: null,
  };
}
