import dayjs from "dayjs";

export type SearchParams = Record<string, string | string[] | undefined>;

function getFirstSearchParamValue(
  searchParams: SearchParams,
  key: string,
): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export function getDebugDateFromSearchParams(
  searchParams: SearchParams,
): dayjs.Dayjs | undefined {
  const rawDate = getFirstSearchParamValue(searchParams, "date");

  if (!rawDate) {
    return undefined;
  }

  const parsed = dayjs(rawDate);
  return parsed.isValid() ? parsed : undefined;
}
