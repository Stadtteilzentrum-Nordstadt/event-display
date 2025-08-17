"use client";

import dayjs from "dayjs";

import "dayjs/locale/de";
import { useEffect, useState } from "react";
import { type AppConfig } from "../loadConfig";

export default function WeekSelection(props: {
  config: AppConfig;
  currentWeekStart: dayjs.Dayjs;
  setCurrentWeekStart: (date: dayjs.Dayjs) => void;
}) {
  const currentWeekStart = props.currentWeekStart;
  const setCurrentWeekStart = props.setCurrentWeekStart;

  const [currentWeekEnd, setCurrentWeekEnd] = useState(
    currentWeekStart.weekday(6),
  );
  //   const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  useEffect(() => {
    setCurrentWeekEnd(currentWeekStart.weekday(6));
  }, [currentWeekStart]);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 p-4 sm:flex-row">
          <button
            className="rounded-md px-4 py-2 text-white hover:opacity-80"
            style={{ backgroundColor: props.config.frontend.themeColor }}
            onClick={() => {
              setCurrentWeekStart(currentWeekStart.subtract(1, "week"));
            }}
          >
            Vorherige
          </button>
          <p className="text-center text-2xl">
            {currentWeekStart.format("DD.MM.YYYY")} -{" "}
            {currentWeekEnd.format("DD.MM.YYYY")} (KW{" "}
            {currentWeekStart.isoWeek()})
          </p>
          <button
            className="rounded-md px-4 py-2 text-white hover:opacity-80"
            style={{ backgroundColor: props.config.frontend.themeColor }}
            onClick={() => {
              setCurrentWeekStart(currentWeekStart.add(1, "week"));
            }}
          >
            Nächste
          </button>
        </div>
        <button
          className="rounded-md px-4 py-2 text-white hover:opacity-80"
          style={{ backgroundColor: props.config.frontend.themeColor }}
          onClick={() => {
            setCurrentWeekStart(dayjs().weekday(0));
          }}
        >
          Aktuelle
        </button>
      </div>
    </>
  );
}
