import { Mail, Phone } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ContactWhatsAppWidget } from "@/components/custom/contact-whatsapp-widget"
import Divider from "@/components/custom/divider"
import { LoadingCard } from "@/components/custom/loading"
import { ADMIN_EMAIL, ADMIN_PHONE, APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { ContactForm } from "./contact-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `تواصل مع | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export default function Contact() {
  return (
    <section className="min-h-screen w-full py-16 px-4 md:px-6">
      <ContactWhatsAppWidget />
      <div className="container mx-auto max-w-6xl space-y-8 md:space-y-12">
        <div className="text-center space-y-4">
          <span className="text-sm font-semibold">تواصل معنا</span>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">تواصل مع فريقنا المتحمس</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            نحن نحب أن نساعدك. قم بملء النموذج أو أرسل لنا بريدًا إلكترونيًا.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
          <div className="text-center space-y-4">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent">
              <Mail className="h-6 w-auto" />
            </span>
            <div className="space-y-2">
              <p className="text-lg font-semibold">البريد الإلكتروني</p>
              <p className="text-sm md:text-base text-muted-foreground">
                فريقنا على أتم الاستعداد لمساعدتك.
              </p>
              <Link href={`mailto:${ADMIN_EMAIL}`} className="font-semibold hover:underline">
                {ADMIN_EMAIL}
              </Link>
            </div>
          </div>

          <div className="text-center space-y-4">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent">
              <Phone className="h-6 w-auto" />
            </span>
            <div className="space-y-2">
              <p className="text-lg font-semibold">اتصل بنا</p>
              <p className="text-sm md:text-base text-muted-foreground">
                نحن متاحون يوميًا في كل الأوقات.
              </p>
              <Link href={`tel:${ADMIN_PHONE}`} className="font-semibold hover:underline" dir="ltr">
                {ADMIN_PHONE}
              </Link>
            </div>
          </div>
        </div>

        <Divider className="my-8 md:my-12" />

        <Suspense fallback={<LoadingCard renderedSkeletons={3} />}>
          <ContactForm />
        </Suspense>
      </div>
    </section>
  )
}
