import type { Metadata } from 'next'
import './globals.css'

export const viewport = { themeColor: "#00dcff", width: "device-width", initialScale: 1 }

export const metadata: Metadata = {
  title: 'TalentLaunch – AI Career OS',
  description: 'AI-powered job search, resume scorer, mock interviews, and career tracker for CS freshers.',
  keywords: 'jobs, fresher, AI, resume, career, interview, internship',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><link rel="manifest" href="/manifest.json"/><meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/></head>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="grid-bg min-h-screen">{children}</body>
    </html>
  )
}
