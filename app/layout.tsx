import type { Metadata } from "next";
import { Geist, Geist_Mono, Julius_Sans_One, Almarai } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const almarai = Almarai({
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  subsets: ["arabic"],
  display: "swap",
});

const juliusSansOne = Julius_Sans_One({
  weight: "400",
  variable: "--font-julius-sans-one",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Prompt Library - Discover & Share AI Prompts",
    template: "%s | Prompt Library",
  },
  description: "The best place to find, create, and organize prompts for ChatGPT, Claude, Midjourney, and more. Join our community of AI enthusiasts.",
  keywords: ["AI prompts", "ChatGPT prompts", "Claude prompts", "Midjourney prompts", "prompt library", "AI tools", "prompt engineering"],
  authors: [{ name: "Prompt Library Team" }],
  creator: "Prompt Library",
  publisher: "Prompt Library",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3001'),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_SA"],
    url: "/",
    title: "Prompt Library - Discover & Share AI Prompts",
    description: "The best place to find, create, and organize prompts for ChatGPT, Claude, Midjourney, and more.",
    siteName: "Prompt Library",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Library - Discover & Share AI Prompts",
    description: "The best place to find, create, and organize prompts for ChatGPT, Claude, Midjourney, and more.",
    creator: "@promptlibrary",
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
    google: "your-google-verification-code",
  },
};

import { auth } from "@/auth";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/providers/SessionProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import ConditionalLayout from "@/components/ConditionalLayout";
import { checkSecurityConfig } from "@/lib/security-check";

// Run security checks on app startup
if (typeof window === 'undefined') {
  checkSecurityConfig();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${almarai.variable} ${juliusSansOne.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ReactQueryProvider>
            <LanguageProvider>
              <ConditionalLayout user={session?.user}>
                {children}
              </ConditionalLayout>
            </LanguageProvider>
            <Toaster />
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
