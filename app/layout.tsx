import type { Metadata } from "next";
import { Bebas_Neue, Inter, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupPopup from "@/components/SignupPopup";
import JsonLd from "@/components/JsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { site } from "@/lib/site";
import "./globals.css";

export const viewport = {
  themeColor: "#0e0d0c",
};

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Auric Performance | 1:1 Personal Trainer, Southwest UK",
    template: "%s | Auric Performance",
  },
  description: site.description,
  metadataBase: new URL(site.url),
  applicationName: "Auric Performance",
  authors: [{ name: "Auric Performance", url: "https://www.auricperformance.co.uk" }],
  creator: "Auric Performance",
  publisher: "Auric Performance",
  category: "fitness",
  keywords: [
    "1:1 personal trainer",
    "personal trainer southwest",
    "physical performance coach",
    "online programming",
    "personal trainer Taunton",
    "personal trainer Somerset",
    "hybrid training",
    "exercise rehabilitation",
    "OUTRUN",
    "OUTLIFT",
    "OUTPERFORM",
  ],
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
  openGraph: {
    title: "Auric Performance | 1:1 Personal Trainer, Southwest UK",
    description: site.description,
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: "Auric Performance",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Auric Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auric Performance | 1:1 Personal Trainer, Southwest UK",
    description: site.description,
    images: ["/images/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  verification: {
    google: "FbSikXKWEQaKc4FdUU0ubmMBmIyt6pmOEQ_tmJ0LE5U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebas.variable} ${oswald.variable} ${inter.variable}`}
        style={
          {
            "--title": bebas.style.fontFamily,
            "--sub": oswald.style.fontFamily,
            "--body": inter.style.fontFamily,
            fontFamily: inter.style.fontFamily,
          } as React.CSSProperties
        }
      >
        <GoogleAnalytics />
        <JsonLd />
        <Header />
        {children}
        <Footer />
        <SignupPopup />
      </body>
    </html>
  );
}
