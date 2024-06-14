import DateDisplay from "~/components/date-display";
import { type AppConfig } from "./loadConfig";
import Image from "next/image";

export default function Header(props: { config: AppConfig }) {
  return (
    <header
      className="static flex items-center justify-between border-b-2 bg-zinc-50 p-8 py-12"
      style={{ borderColor: props.config.frontend.themeColor }}
    >
      <div className="flex flex-col text-lg font-medium">
        <h1 className="text-2xl font-bold">{props.config.frontend.title}</h1>
        <DateDisplay />
      </div>
      <div>
        <Image
          src={props.config.frontend.icon}
          alt="App icon"
          className="h-full "
          height={90}
          width={200}
        />
      </div>
    </header>
  );
}
