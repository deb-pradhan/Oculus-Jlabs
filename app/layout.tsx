import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider, themeScript } from "@/components/layout/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Oculus | Crypto Market Intelligence by Jlabs Digital",
    template: "%s | Oculus by Jlabs",
  },
  description:
    "Quantitative crypto market research, derivatives analysis, and on-chain intelligence. Updated daily by Jlabs Digital.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://oculus.jlabsdigital.com"
  ),
  openGraph: {
    type: "website",
    siteName: "Oculus by Jlabs Digital",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@jlabsdigital",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
