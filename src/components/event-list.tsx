"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { EventEntry } from "./event-entry";
import { type AppConfig } from "~/app/loadConfig";

export type Event = {
  id: string;
  title: string;
  times: { start: Date; end: Date }[];
  description?: string;
  level: string;
};

export default function EventList(props: {
  events: Event[];
  className?: string;
  config: AppConfig;
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const childRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!parentRef.current) return;
    if (!childRef.current) return;

    const interval = setInterval(() => {
      if (parentRef.current && childRef.current) {
        if (parentRef.current.scrollHeight > parentRef.current.clientHeight) {
          parentRef.current.scrollTo({
            top:
              parentRef.current.scrollTop +
              childRef.current.clientHeight *
                (parentRef.current.clientHeight /
                  childRef.current.clientHeight) -
              2 * childRef.current.clientHeight,
            behavior: "smooth",
          });
          if (
            parentRef.current.scrollTop >=
            parentRef.current.scrollHeight - parentRef.current.clientHeight
          ) {
            parentRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      }
    }, props.config.frontend.scrollInterval * 1000);

    return () => clearInterval(interval);
  }, [props.events, parentRef, childRef, props.config.frontend.scrollInterval]);

  return (
    <div
      ref={parentRef}
      className={clsx(
        "rounded-lg border-2 border-zinc-300 bg-zinc-50 [&>*:nth-child(odd)]:bg-zinc-100",
        props.className,
      )}
    >
      {props.events
        .sort((a, b) => {
          return a.times[0]!.end.getTime() - b.times[0]!.end.getTime();
        })
        .sort((a, b) => {
          return a.times[0]!.start.getTime() - b.times[0]!.start.getTime();
        })
        .map((event) => (
          <EventEntry event={event} key={event.id} ref={childRef} />
        ))}
    </div>
  );
}
