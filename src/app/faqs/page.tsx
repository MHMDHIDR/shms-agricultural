import Link from "next/link"
import { ContactWhatsAppWidget } from "@/components/custom/contact-whatsapp-widget"
import FAQ from "@/components/custom/faqs"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `الأسئلة الشائعة | ${APP_TITLE}`,
  authors: [{ name: "Mohammed Ibrahim", url: "https://mohammedhaydar.com" }],
  description: APP_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

// Force static generation
export const dynamic = "force-static"
export const revalidate = false
export const fetchCache = "force-cache"
export const runtime = "nodejs"

export default async function page() {
  return (
    <>
      <ContactWhatsAppWidget />
      <FAQ pathname="/faqs" />

      <div className="flex flex-col items-center justify-center gap-y-14 select-none md:gap-y-20">
        <Link
          href="/projects"
          className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 font-extrabold text-white"
        >
          إبدأ الاستثمار الآن
        </Link>
        <div className="flex items-center gap-x-6">
          <h2 className="text-lg">لديك استفسار؟</h2>
          <Link
            href="/contact"
            className="bg-secondary hover:bg-secondary/90 rounded-md px-4 py-2 text-white"
          >
            يمكننا مساعدتك
          </Link>
        </div>
      </div>
    </>
  )
}
