"use server";

import dayjs from "dayjs";
import { type AppConfig } from "../loadConfig";
import getCalendar from "~/lib/get-calendar";
import { type Event } from "~/components/event-list";

export async function getNewPlanData(
  config: AppConfig,
  currentWeekStart: string,
): Promise<Event[][]> {
  const dayPromises = Array.from({ length: 7 }, (_, i) => {
    const day = dayjs(currentWeekStart).add(i, "day");
    return getCalendar(config, day);
  });

  return await Promise.all(dayPromises).then((responses) =>
    responses.map((response) => response.events),
  );
}
