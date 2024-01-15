import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Cairo as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import Toaster from '@/components/Toaster'
import Nav from '@/components/Navigation/Nav'
import { ThemeProvider } from '@/providers/ThemeProvider'
import SessionProvider from '@/providers/SessionProvider'
import './globals.css'

export const fontSans = FontSans({
  subsets: ['arabic'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: 'شمس | للخدمات الزراعية',
  description: 'شمــس | منصة الخدمات الزراعية للمستثمرين والمزارعين السودانيين'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang='ar'>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased bg-gray-100 dark:bg-gray-900',
          fontSans.variable
        )}
      >
        <SessionProvider session={session}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <Toaster />
            <Nav />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
