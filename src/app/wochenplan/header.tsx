import { type AppConfig } from "../loadConfig";

export default function Header(props: { config: AppConfig }) {
  return (
    <header
      className="static flex items-center justify-between border-b-2 bg-zinc-50 p-8"
      style={{ borderColor: props.config.frontend.themeColor }}
    >
      <div className="flex flex-col text-lg font-medium">
        <h1 className="text-2xl font-bold">Wochenplan</h1>
      </div>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={props.config.frontend.icon}
          alt="App icon"
          className="h-full"
          height={90}
          width={200}
        />
      </div>
    </header>
  );
}
