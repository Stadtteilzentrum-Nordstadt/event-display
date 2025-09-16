import "~/styles/globals.css";

import { Poppins } from "next/font/google";
import ScaleController from "~/components/dpi-scaler";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.className} h-full`}>
      <body className="grid h-full grid-rows-10">
        <ScaleController>{children}</ScaleController>
      </body>
    </html>
  );
}
