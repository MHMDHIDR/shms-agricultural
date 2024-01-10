import type { Metadata } from 'next'
import { Cairo as FontSans } from 'next/font/google'
import './globals.css'
import Toaster from '@/components/Toaster'
import Nav from '@/components/Navigation/Nav'
import { ThemeProvider } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

export const fontSans = FontSans({
  subsets: ['arabic'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'Sun Project',
  description: 'Sun Project'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ar'>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Toaster />
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
