import { forwardRef } from "react";
import { type Event } from "./event-list";
import clsx from "clsx";

export const EventEntry = forwardRef(function EventEntry(
  props: {
    event: Event;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      className={clsx(
        "relative grid min-h-20 grid-flow-row grid-cols-5 p-4",
        props.event.status === "CANCELLED" && "text-red-600",
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
                      <p>
                        {props.event.openEnd ? "ab " : ""}
                        {time.start.getHours().toString().padStart(2, "0")}:
                        {time.start.getMinutes().toString().padStart(2, "0")}
                      </p>
                      {!props.event.openEnd && (
                        <>
                          <p>-</p>
                          <p>
                            {time.end.getHours().toString().padStart(2, "0")}:
                            {time.end.getMinutes().toString().padStart(2, "0")}
                          </p>
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
          "my-auto justify-self-end font-medium",
          props.event.status === "CANCELLED" && "line-through",
        )}
      >
        {props.event.level}
      </p>
    </div>
  );
});
