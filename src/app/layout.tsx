import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://business-valuation-calculator.vercel.app"),
  title: {
    default: "Business Valuation Calculator | Aspen Valuations",
    template: "%s | Aspen Valuations",
  },
  description:
    "Three questions, an indicative valuation range. Estimate what your business is worth using current Canadian EBITDA multiples for your industry and business profile.",
  keywords: [
    "business valuation calculator",
    "EBITDA multiple",
    "what is my business worth",
    "Canadian business valuation",
    "Aspen Valuations",
  ],
  openGraph: {
    title: "Business Valuation Calculator | Aspen Valuations",
    description:
      "Three questions, an indicative valuation range based on current Canadian EBITDA multiples.",
    type: "website",
    siteName: "Aspen Valuations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Valuation Calculator | Aspen Valuations",
    description:
      "Three questions, an indicative valuation range based on current Canadian EBITDA multiples.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white">{children}</body>
    </html>
  );
}
