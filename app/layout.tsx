import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'ASTROCARE | Spaceflight Health Companion',
  description: 'A calm, mission-aware health check-in concept for long-duration spaceflight.',
  applicationName: 'ASTROCARE',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  colorScheme: 'dark',
  themeColor: '#050816',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
