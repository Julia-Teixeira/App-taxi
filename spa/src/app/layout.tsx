import type { Metadata } from "next";
import "./globals.css";
import RideProvider from "@/provider/rideProvider";
import MapProvider from "@/provider/mapProvider";
import Header from "@/components/header";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Taxi APP",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <main>
          <RideProvider>
            <MapProvider>
              <Header />
              {children}
              <ToastContainer />
            </MapProvider>
          </RideProvider>
        </main>
      </body>
    </html>
  );
}
