import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  DM_Sans,
  Geist_Mono,
  Space_Grotesk,
  Syne,
} from "next/font/google";
import "./globals.css";
import "../styles/portfolio.css";
import { getThemeStyle } from "@/lib/theme";
import { FocusNavigationIntent } from "@/components/ui/focus-navigation-intent";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({ variable: "--font-syne", subsets: ["latin"], preload: false });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  title: "Affan Khan",
  description: "Software engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${dmSans.variable} ${geistMono.variable} ${syne.variable} ${spaceGrotesk.variable} h-full antialiased`}
      style={getThemeStyle("dark")}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <FocusNavigationIntent />
        {children}
      </body>
    </html>
  );
}
