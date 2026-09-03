import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DigitalSippoy — TypeScript · Node 20.x · npm",
  description: "DigitalSippoy FE TypeScript fixture — Next.js 15.5.24, React 19.1.0, App Router, Turbopack.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
