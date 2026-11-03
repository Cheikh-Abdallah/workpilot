import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SerwistProvider } from "./serwist";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "WorkPilot",
  title: {
    default: "WorkPilot | Gestion des activités",
    template: "%s | WorkPilot",
  },
  description:
    "WorkPilot : une solution simple pour gérer vos activités, votre planning et vos statistiques.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WorkPilot",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#060691",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SerwistProvider swUrl="/sw.js">
          {children}
        </SerwistProvider>
      </body>
    </html>
  );
}