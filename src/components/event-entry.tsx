import { forwardRef } from "react";
import { type Event } from "./event-list";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const EventEntry = forwardRef(function EventEntry(
  props: {
    event: Event;
    referenceDateISO: string;
    timeZone: string;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const tz = props.timeZone;
  const referenceDayStart = dayjs(props.referenceDateISO).tz(tz).startOf("day");

  return (
    <div
      className={clsx(
        "relative grid min-h-20 grid-flow-row grid-cols-5 p-4",
        props.event.status === "CANCELLED" && "text-red-500",
      )}
      ref={ref}
    >
      <div
        className="absolute top-0 left-0 z-0 h-full w-2 rounded-r-md"
        style={{ backgroundColor: props.event.color }}
      ></div>
      <div className="flex flex-col font-medium">
        {props.event.status !== "CANCELLED" && (
          <>
            {props.event.times
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map((time) => (
                <div
                  key={time.start.toString() + time.end.toString()}
                  className={clsx("my-auto flex flex-row")}
                >
                  {props.event.allDay ? (
                    <p>ganztägig</p>
                  ) : (
                    <>
                      {dayjs(time.start).tz(tz).isBefore(referenceDayStart) ? (
                        <>
                          <p>
                            {"bis "}
                            {dayjs(time.end).tz(tz).format("HH")}:
                            {dayjs(time.end).tz(tz).format("mm")}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            {props.event.openEnd && "ab "}
                            {dayjs(time.start).tz(tz).format("HH")}:
                            {dayjs(time.start).tz(tz).format("mm")}
                          </p>
                          {!props.event.openEnd && (
                            <>
                              <p>-</p>
                              <p>
                                {dayjs(time.end).tz(tz).format("HH")}
                                :
                                {dayjs(time.end).tz(tz).format("mm")}
                              </p>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
          </>
        )}
        {props.event.status === "CANCELLED" && (
          <p className="my-auto font-bold">Veranstaltung fällt aus</p>
        )}
      </div>
      <div
        className={clsx(
          "col-span-3 flex flex-col justify-center",
          props.event.status === "CANCELLED" && "line-through",
        )}
      >
        <h3 className="font-semibold">{props.event.title}</h3>
        {props.event.description && (
          <p className="font-regular">{props.event.description}</p>
        )}
      </div>
      <p
        className={clsx(
          "my-auto justify-self-end font-medium text-right",
          props.event.status === "CANCELLED" && "line-through",
        )}
      >
        {props.event.level}
      </p>
    </div>
  );
});
