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
  title: "Prompt Library",
  description: "A library for AI prompts",
};

import { auth } from "@/auth";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${almarai.variable} ${juliusSansOne.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          <Header user={session?.user} />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
