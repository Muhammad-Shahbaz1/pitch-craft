import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pitch-Craft | AI Pitch Deck Builder & Presentation Studio",
  description: "Create, refine, present, and export high-converting investor pitch decks powered by Gemini AI.",
  keywords: ["pitch deck", "AI pitch deck generator", "startup funding", "investor presentation", "venture capital", "PowerPoint export"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Pitch-Craft | AI Pitch Deck Builder",
    description: "Generate investor-ready pitch decks in seconds with Gemini AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-200`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
