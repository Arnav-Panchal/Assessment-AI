import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Immigration Chatbot",
  description: "Chatbot app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navbar */}
        <nav className="bg-blue-600 text-black p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Immigration Chatbot</h1>
          <div className="space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/login" className="hover:underline">
              DashBoard
            </Link>
          </div>
        </nav>

        {/* Page content */}
        {children}
      </body>
    </html>
  );
}
