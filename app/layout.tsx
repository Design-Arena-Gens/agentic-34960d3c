import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tally Prime TDL Editor',
  description: 'Online Tally Definition Language (TDL) Editor and Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
