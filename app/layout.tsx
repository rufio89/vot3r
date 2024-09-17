import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import { AuthProvider } from './context/AuthContext';
import { MovieNightProvider } from './context/MovieNightContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Flickoff",
  description: "Flickoff is a movie night planning app that allows you to create and join movie nights with your friends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <MovieNightProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50`}
          >
            <div className="flex flex-1 overflow-hidden">
              <Sidebar className="hidden md:block" />
              <main className="flex-1 overflow-auto p-4 md:p-8 pb-16 md:pb-8">
                {children}
              </main>
            </div>
            <BottomNav className="md:hidden" />
          </body>
        </MovieNightProvider>
      </AuthProvider>
    </html>
  );
}
