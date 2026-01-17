import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://clear-sarkari-exam.vercel.app'),
  title: {
    default: "Clear Sarkari Exam - Latest Government Job Notifications 2026",
    template: "%s | Clear Sarkari Exam"
  },
  description: "Get latest government job notifications, Sarkari exam updates, results, and admit cards. Stay updated with central and state government job openings in India.",
  keywords: [
    "sarkari exam",
    "government jobs",
    "sarkari naukri",
    "job notifications",
    "admit card",
    "government job results",
    "latest jobs",
    "central government jobs",
    "state government jobs",
    "sarkari result"
  ],
  authors: [{ name: "Clear Sarkari Exam" }],
  creator: "Clear Sarkari Exam",
  publisher: "Clear Sarkari Exam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Clear Sarkari Exam",
    title: "Clear Sarkari Exam - Latest Government Job Notifications 2026",
    description: "Get latest government job notifications, Sarkari exam updates, results, and admit cards. Stay updated with central and state government job openings in India.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Clear Sarkari Exam - Latest Government Job Notifications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clear Sarkari Exam - Latest Government Job Notifications 2026",
    description: "Get latest government job notifications, Sarkari exam updates, results, and admit cards.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: 1024,
  initialScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://clear-sarkari-exam.vercel.app'} />
        <meta name="theme-color" content="#BF1A1A" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
