import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <AuthProvider>
          <MovieNightProvider>
            <ClientLayout>{children}</ClientLayout>
          </MovieNightProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
