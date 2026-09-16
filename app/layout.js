import { siteUrl } from "./sitePath";
import "./globals.css";

export const metadata = {
  title: "Compare Global eSIM Plans for International Travel | eSIM Global",
  description: "Compare prepaid travel eSIM plans, providers, data, validity and prices for 190+ countries. Find the best international eSIM before you travel.",
  keywords: ["global eSIM", "international eSIM", "travel eSIM", "compare eSIM plans", "prepaid eSIM", "eSIM for international travel"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: siteUrl("/") },
  openGraph: {
    title: "Compare Global eSIM Plans for International Travel",
    description: "Compare travel eSIM providers, coverage and prices across 190+ destinations.",
    url: siteUrl("/"),
    siteName: "eSIM Global Travel",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
