import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-[#090d16] text-slate-100 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
