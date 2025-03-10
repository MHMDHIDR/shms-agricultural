import "@/styles/globals.css"
import { SessionProvider } from "next-auth/react"
import { Noto_Kufi_Arabic } from "next/font/google"
import Footer from "@/components/custom/footer"
import { Nav } from "@/components/custom/nav"
import { NavigateTop } from "@/components/custom/navigate-top"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { Providers } from "@/providers"
import { ThemeProvider } from "@/providers/theme-provider"
import { auth } from "@/server/auth"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: APP_TITLE,
  authors: [{ name: "Mohammed Ibrahim", url: "https://mohammedhaydar.com" }],
  description: APP_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export const viewport: Viewport = {
  themeColor: "#22c55f",
}

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-kufi",
})

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  const user = session?.user

  return (
    <html lang="ar" className={`${notoKufiArabic.variable}`} suppressHydrationWarning dir="rtl">
      <head>
        <script
          defer
          src="https://analytics.technodevlabs.com/script.js"
          data-website-id="e33f6fbd-145d-4d40-a9cf-d93a5681e1f8"
        ></script>
      </head>
      <body
        className="font-noto-kufi flex min-h-screen flex-col bg-background text-slate-900 dark:text-slate-50"
        suppressHydrationWarning
      >
        <SessionProvider>
          <Providers>
            <ThemeProvider attribute="class" enableSystem={false}>
              <Nav user={user} key={user?.image ?? "no-image"} />
              <main className="flex-1">{children}</main>
              <NavigateTop />
              <Footer />
            </ThemeProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}
