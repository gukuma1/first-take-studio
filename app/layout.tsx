import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'First Take Studio',
  description: 'Gerencie seu próprio estúdio de cinema, produza filmes e ganhe premiações!'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
