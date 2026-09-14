import type { Metadata } from "next";
import { Bebas_Neue, Inter, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupPopup from "@/components/SignupPopup";
import JsonLd from "@/components/JsonLd";
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
    default: "Auric Performance | Physical Performance Coaching",
    template: "%s | Auric Performance",
  },
  description:
    "Hybrid training, rehabilitation and 1:1 coaching by Royal Marine PTIs. OUTRUN, OUTLIFT, OUTPERFORM and Auric Rehab from Taunton, UK.",
  metadataBase: new URL("https://auricperformance.co.uk"),
  applicationName: "Auric Performance",
  authors: [{ name: "Auric Performance", url: "https://auricperformance.co.uk" }],
  creator: "Auric Performance",
  publisher: "Auric Performance",
  category: "fitness",
  keywords: [
    "hybrid training",
    "strength and conditioning",
    "exercise rehabilitation",
    "1:1 coaching",
    "Royal Marine PTI",
    "Taunton personal training",
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
    title: "Auric Performance | Physical Performance Coaching",
    description:
      "Hybrid training, rehabilitation and 1:1 coaching by Royal Marine PTIs.",
    type: "website",
    locale: "en_GB",
    url: "https://auricperformance.co.uk",
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
    title: "Auric Performance | Physical Performance Coaching",
    description:
      "Hybrid training, rehabilitation and 1:1 coaching by Royal Marine PTIs.",
    images: ["/images/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
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
        <JsonLd />
        <Header />
        {children}
        <Footer />
        <SignupPopup />
      </body>
    </html>
  );
}
