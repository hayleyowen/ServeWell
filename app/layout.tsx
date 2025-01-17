import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideNav from '@/app/components/SideNav';
import TopNav from '@/app/components/TopNav';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <SideNav />
        <div className="ml-64 p-4">
          {children}
        </div> */}
        <TopNav />
        <div className="ml-64 p-4">
          {children}
        </div>

      </body>
    </html>
  );
}
