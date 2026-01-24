import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Link from 'next/link'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Immigration Chatbot',
  description: 'AI-powered immigration assessment chatbot',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        {/* Navigation */}
        <nav className="border-b border-border bg-secondary/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-foreground hover:text-accent transition-colors">
              Immigration Chatbot
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-muted-foreground hover:text-accent transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-accent transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* Page content */}
        {children}
        <Analytics />
      </body>
    </html>
  )
}
