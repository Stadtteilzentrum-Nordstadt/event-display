import { forwardRef } from "react";
import { type Event } from "./event-list";

export const EventEntry = forwardRef(function EventEntry(
  props: {
    event: Event;
    ref: React.RefObject<HTMLDivElement>;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div className="grid grid-flow-row grid-cols-5 p-4" ref={ref}>
      <div className="flex flex-col font-medium">
        {props.event.times.map((time) => (
          <div
            key={time.start.toString() + time.end.toString()}
            className="my-auto flex flex-row"
          >
            <p>
              {time.start.getHours().toString().padStart(2, "0")}:
              {time.start.getMinutes().toString().padStart(2, "0")}
            </p>
            <p>-</p>
            <p>
              {time.end.getHours().toString().padStart(2, "0")}:
              {time.end.getMinutes().toString().padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>
      <div className="col-span-3">
        <h3 className="font-semibold">{props.event.title}</h3>
        <p className="font-regular">{props.event.description}</p>
      </div>
      <p className="my-auto justify-self-end font-medium">
        {props.event.level}
      </p>
    </div>
  );
});
