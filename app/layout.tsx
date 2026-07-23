import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000",
);

const title = "Opengg - Open Graph Image Generator";
const description =
  "Design, preview, and export polished Open Graph images, social preview cards, and website banners with templates, custom graphics, textures, and live editor controls.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Opengg",
  title: {
    default: title,
    template: "%s | Opengg",
  },
  description,
  keywords: [
    "Open Graph generator",
    "OG image generator",
    "social preview image",
    "website banner maker",
    "Twitter card image",
    "LinkedIn preview image",
    "social media preview",
    "Opengg",
  ],
  authors: [{ name: "Opengg" }],
  creator: "Opengg",
  publisher: "Opengg",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Opengg",
    images: [
      {
        url: "https://i.ibb.co/6RmCQhKH/opengg.jpg",
        width: 2400,
        height: 1260,
        alt: "Opengg Open Graph image generator preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://i.ibb.co/6RmCQhKH/opengg.jpg"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.variable} antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
