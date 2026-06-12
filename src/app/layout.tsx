import type { Metadata } from "next";
import { Geist, Noto_Sans_Telugu } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/romanization";
import { AppNav } from "@/components/AppNav";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-telugu",
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Leepi — Learn to read Telugu",
  description:
    "Learn to read written Telugu: alphabet, words and sentences with flashcards, quizzes, audio and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${notoTelugu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SettingsProvider>
          <AppNav />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
            {children}
          </main>
          <SiteFooter />
        </SettingsProvider>
      </body>
    </html>
  );
}
