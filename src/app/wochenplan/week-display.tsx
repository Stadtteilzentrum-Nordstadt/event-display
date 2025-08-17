"use client";

import dayjs from "dayjs";
import { type AppConfig } from "../loadConfig";
import clsx from "clsx";
import "dayjs/locale/de";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { type Event } from "~/components/event-list";

export default function WeekDisplay(props: {
  config: AppConfig;
  currentWeekStart: string;
  events: Event[][];
}) {
  dayjs.locale("de");
  dayjs.extend(isoWeek);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(weekday);
  const currentWeekStart = dayjs(props.currentWeekStart).tz(
    props.config.calendar.timeZone,
  );
  const events = props.events;

  return (
    <>
      <div className="mx-15 py-10">
        <table className="w-full table-fixed overflow-auto">
          <caption className="caption-bottom text-left">
            Legende: <span className="text-red-400">Abgesagt</span>,{" "}
            <span className="text-blue-400">Privat</span>
          </caption>
          <thead className="bg-zinc-300">
            <tr className="">
              <th scope="col"></th>
              {Array.from({ length: 7 }, (_, i) => (
                <th key={i} className="text-left" scope="col">
                  <h2 className="text-xl font-semibold">
                    {currentWeekStart.weekday(i).format("dddd")}
                  </h2>
                  <p className="text-lg font-normal">
                    {currentWeekStart.weekday(i).format("DD.MM.YYYY")}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.config.calendar.calendars.map((calendar, i) => (
              <tr
                key={calendar.name}
                className={clsx(i % 2 === 0 ? "bg-zinc-100" : "bg-zinc-200")}
              >
                <th scope="row" className="py-5 font-semibold">
                  {calendar.name}{" "}
                  {calendar.location && (
                    <span className="font-normal">({calendar.location})</span>
                  )}
                </th>
                {events.map((dayEvents, dayIndex) => {
                  const events = dayEvents.filter(
                    (e) => e.calendar === calendar.name,
                  );
                  return (
                    <td
                      key={`${calendar.name}-${dayIndex}`}
                      className="px-2 py-5"
                    >
                      {events.length > 0 ? (
                        events.map((event) => (
                          <h3
                            key={event.id}
                            className={clsx(
                              "text-md py-1 text-left font-semibold",
                              event.status === "CANCELLED" && "text-red-400",
                              event.private && "text-blue-400",
                            )}
                          >
                            {event.title} (
                            {!event.allDay
                              ? event.times
                                  .map(
                                    (time) =>
                                      `${dayjs(time.start).format("HH:mm")} - ${dayjs(time.end).format("HH:mm")}`,
                                  )
                                  .join(", ")
                              : "Ganztägig"}
                            )
                          </h3>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500">
                          Keine Veranstaltungen
                        </p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
