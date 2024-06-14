"use server";

import { env } from "~/env";
import fs from "node:fs/promises";
import toml from "toml";
import { z } from "zod";

const AppConfigSchema = z.object({
  frontend: z.object({
    title: z.string(),
    icon: z.string(),
    themeColor: z.string(),
    scrollInterval: z.number().default(5000),
  }),
  calendar: z.object({
    timeZone: z.string().default("Europe/Berlin"),
    refreshInterval: z.number().default(60 * 5),
    calendars: z.array(
      z.object({
        name: z.string(),
        url: z.string(),
      }),
    ),
    ignoreKeywords: z.array(z.string()).default([]),
    timeout: z.number().default(0),
    auth: z.object({
      type: z.enum(["basic"]).default("basic"),
      username: z.string(),
      password: z.string(),
    }),
  }),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

export async function loadConfig(): Promise<AppConfig> {
  const configPath = env.CONFIG_PATH;
  const content = await fs.readFile(configPath, "utf8");
  return AppConfigSchema.parse(toml.parse(content));
}
