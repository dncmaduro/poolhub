import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ClientProvider from '@/app/client-provider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'PoolHub',
  description: 'Community for Billiards Players in Vietnam'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mb-20 antialiased`}
      >
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  )
}
