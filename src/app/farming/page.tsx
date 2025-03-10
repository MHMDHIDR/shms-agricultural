import Image from "next/image"
import Link from "next/link"
import { ContactWhatsAppWidget } from "@/components/custom/contact-whatsapp-widget"
import { Button } from "@/components/ui/button"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { getBlurPlaceholder } from "@/lib/optimize-image"
import { services } from "@/schemas/contact"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `الـــزراعة | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

// Force static generation
export const dynamic = "force-static"
export const revalidate = false
export const fetchCache = "force-cache"
export const runtime = "nodejs"

export default async function Farming() {
  const imagePath = "/our-services/farming.webp"
  const blurImage = await getBlurPlaceholder({ imageSrc: imagePath })

  const serviceIndex = 1

  return (
    <main className="flex min-h-full flex-col items-center -mb-22">
      <ContactWhatsAppWidget />
      <h1 className="mt-10 text-2xl select-none">الزراعة</h1>

      <div className="flex w-full flex-col items-center">
        <div className="relative mt-12 w-full min-w-screen">
          <Image
            src={imagePath}
            width={1200}
            height={800}
            alt="الزراعة"
            className="h-[600px] w-full object-cover"
            placeholder="blur"
            blurDataURL={blurImage ?? undefined}
            priority
          />

          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-7">
            <p className="px-5 text-right text-lg leading-10 text-white md:px-10 md:leading-12">
              خطوة الزراعة وتتم أولاً بتحديد طريقة الزراعة إما يدوية أو آلية. ثانياً، تخطيط
              المسافات. ثالثاً، يتم وضع البذور أو الشتلات في التربة ثم يليها الري المنتظم، وإضافة
              الأسمدة وتكتمل بمكافحة الآفات.
            </p>

            <Link className="my-5 text-xl" href={`/contact?service=${services[serviceIndex]}`}>
              <Button variant={"pressable"} className="px-10">
                طلب الخــدمة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
