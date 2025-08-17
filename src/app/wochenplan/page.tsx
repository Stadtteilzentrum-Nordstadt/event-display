import { loadConfig } from "../loadConfig";
import Header from "./header";
import WeekDisplayRoot from "./week-display-root";

export const dynamic = "force-dynamic";

export default async function WochenplanPage() {
  const config = await loadConfig();

  return (
    <>
      <div className="relative flex h-full w-screen flex-col bg-zinc-200">
        <Header config={config} />
        <WeekDisplayRoot config={config} />
      </div>
    </>
  );
}
