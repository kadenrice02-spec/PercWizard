import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GovSignal",
  description: "Government catalyst tracker for stocks and IPOs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
