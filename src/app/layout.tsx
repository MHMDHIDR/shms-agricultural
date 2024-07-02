import { Toaster } from '@/components/ui/sonner'
import { APP_DESCRIPTION, APP_TITLE } from '@/data/constants'
import { cn } from '@/libs/utils'
import { getServerSession } from 'next-auth'
import { Cairo as FontSans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { FileUploadProvider } from '@/providers/FileUpload'
import { ThemeProvider } from '@/providers/Theme'
import SessionProvider from '@/providers/Session'
import type { Metadata } from 'next'
import './globals.css'

export const fontSans = FontSans({ subsets: ['arabic'], variable: '--font-sans' })

export const metadata: Metadata = { title: APP_TITLE, description: APP_DESCRIPTION }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()

  return (
    <html lang='ar'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1 maximum-scale=1'
        />
        <meta
          name='description'
          content={
            metadata.description ??
            'شمــس | منصة الخدمات الزراعية للمستثمرين والمزارعين السودانيين'
          }
        />
        {/* Meta Descriptive tags */}
        <meta name='author' content='mr.hamood277@gmail.com' />
        <meta name='theme-color' content='#2376EB' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='shortcut icon' href='/favicon.ico' type='image/x-icon' />
        <link rel='apple-touch-icon' href='/ios/192.png' />
        {/* Open Graph Data */}
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='شمس | للخدمات الزراعية' />
        <meta property='og:title' content='شمس | للخدمات الزراعية' />
        <meta
          property='og:description'
          content='شمــس | منصة الخدمات الزراعية للمستثمرين والمزارعين السودانيين'
        />
        <meta
          property='og:image'
          content='https://shmsagricultural.com/logo-slogan.png'
        />
        <meta property='og:image:width' content='192' />
        <meta property='og:image:height' content='128' />
        <meta property='og:url' content='https://shmsagricultural.com/' />
        <meta property='og:locale' content='en_GB' />
        <meta property='og:locale:alternate' content='ar_AR' />
        {/* Twitter Data */}
        <meta property='twitter:title' content='شمس | للخدمات الزراعية' />
        <meta
          name='twitter:image'
          content='https://shmsagricultural.com/logo-slogan.png'
        />
        <meta
          name='twitter:card'
          content='شمــس | منصة الخدمات الزراعية للمستثمرين والمزارعين السودانيين'
        />
        <meta name='twitter:site' content='@mohmdhidr' />
        <meta
          property='twitter:description'
          content='شمــس | منصة الخدمات الزراعية للمستثمرين والمزارعين السودانيين'
        />
        <meta name='github:site' content='@MHMDHIDR' />
        <meta name='github:creator' content='@MHMDHIDR' />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased bg-gray-100 dark:bg-gray-900 overflow-x-clip',
          fontSans.variable
        )}
      >
        <SessionProvider session={session}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <FileUploadProvider>
              <main>
                <NextTopLoader
                  color='#2376EB'
                  // initialPosition={0.08}
                  // crawlSpeed={200}
                  // height={3}
                  // crawl={true}
                  // showSpinner={false}
                  zIndex={1600}
                  showAtBottom={false}
                />
                {children}
              </main>
              <Toaster />
            </FileUploadProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
