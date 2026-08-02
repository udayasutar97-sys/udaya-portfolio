import type { Metadata } from "next";
import "./globals.css";

import SmoothScroll from "@/components/UI/SmoothScroll";
import { UniverseProvider } from "@/components/UI/UniverseContext";
import { PerformanceProvider } from "@/components/UI/PerformanceManager";

export const metadata: Metadata = {
  title: "Udaya Sutar | Developer, Researcher & Athlete",
  description:
    "Portfolio of Udaya Sutar — AI developer, full-stack engineer, quantum computing explorer and athlete.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PerformanceProvider>
          <UniverseProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </UniverseProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
