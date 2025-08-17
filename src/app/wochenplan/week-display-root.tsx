"use client";

import dayjs from "dayjs";
import { type AppConfig } from "../loadConfig";
import WeekSelection from "./week-selection";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { useEffect, useState } from "react";
import WeekDisplay from "./week-display";
import { getNewPlanData } from "./update-plan";
import { type Event } from "~/components/event-list";

export default function WeekDisplayRoot(props: { config: AppConfig }) {
  dayjs.locale("de");
  dayjs.extend(isoWeek);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(weekday);

  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().tz(props.config.calendar.timeZone).weekday(0),
  );

  const [events, setEvents] = useState<Event[][]>([]);

  useEffect(() => {
    setEvents(Array.from({ length: 7 }, () => []));
    async function fetchData() {
      const data = await getNewPlanData(
        props.config,
        currentWeekStart.toISOString(),
      );
      setEvents(data);
    }
    void fetchData();
  }, [currentWeekStart, props.config]);

  return (
    <>
      <WeekSelection
        config={props.config}
        currentWeekStart={currentWeekStart}
        setCurrentWeekStart={setCurrentWeekStart}
      />
      <WeekDisplay
        config={props.config}
        currentWeekStart={currentWeekStart.toISOString()}
        events={events}
      />
    </>
  );
}
