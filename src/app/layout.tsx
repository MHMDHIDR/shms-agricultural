import type { Metadata } from 'next'
import { Cairo as FontSans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import Toaster from '@/components/Toaster'
import Nav from '@/components/Navigation/Nav'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export const fontSans = FontSans({
  subsets: ['arabic'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'شمس | للخدمات الزراعية',
  description:
    'Shms Agricultural is an Agriculture Platform for Sudanese Farming Investors and Farmers.'
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
        <ClerkProvider
          appearance={{
            elements: { footer: 'hidden' },
            layout: {
              logoPlacement: 'inside',
              logoImageUrl: './favicon.svg',
              socialButtonsVariant: 'iconButton',
              socialButtonsPlacement: 'bottom'
            }
          }}
        >
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <Toaster />
            <Nav />
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
