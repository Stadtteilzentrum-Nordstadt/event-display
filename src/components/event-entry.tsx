import { forwardRef } from "react";
import { type Event } from "./event-list";

export const EventEntry = forwardRef(function EventEntry(
  props: {
    event: Event;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div className="grid min-h-20 grid-flow-row grid-cols-5 p-4" ref={ref}>
      <div className="flex flex-col font-medium">
        {props.event.times
          .sort((a, b) => a.start.getTime() - b.start.getTime())
          .map((time) => (
            <div
              key={time.start.toString() + time.end.toString()}
              className="my-auto flex flex-row"
            >
              {props.event.allDay ? (
                <p>ganztägig</p>
              ) : (
                <>
                  <p>
                    {time.start.getHours().toString().padStart(2, "0")}:
                    {time.start.getMinutes().toString().padStart(2, "0")}
                  </p>
                  <p>-</p>
                  <p>
                    {time.end.getHours().toString().padStart(2, "0")}:
                    {time.end.getMinutes().toString().padStart(2, "0")}
                  </p>
                </>
              )}
            </div>
          ))}
      </div>
      <div className="col-span-3 flex flex-col justify-center">
        <h3 className="font-semibold">{props.event.title}</h3>
        {props.event.description && (
          <p className="font-regular">{props.event.description}</p>
        )}
      </div>
      <p className="my-auto justify-self-end font-medium">
        {props.event.level}
      </p>
    </div>
  );
});
