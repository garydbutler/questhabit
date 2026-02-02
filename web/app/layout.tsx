import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuestHabit - Turn Your Habits Into an Epic Adventure",
  description:
    "Gamified habit tracker with AI coaching. Build streaks, earn XP, unlock achievements, and level up your life. Available on iOS and Android.",
  keywords: [
    "habit tracker",
    "gamified habits",
    "AI coach",
    "habit building",
    "streak tracker",
    "productivity app",
    "self improvement",
    "daily habits",
  ],
  openGraph: {
    title: "QuestHabit - Turn Your Habits Into an Epic Adventure",
    description:
      "Gamified habit tracker with AI coaching. Build streaks, earn XP, unlock achievements, and level up your life.",
    url: "https://questhabit.com",
    siteName: "QuestHabit",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuestHabit - Turn Your Habits Into an Epic Adventure",
    description:
      "Gamified habit tracker with AI coaching. Build streaks, earn XP, unlock achievements, and level up your life.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
