import Image from "next/image"
import Link from "next/link"
import { ContactWhatsAppWidget } from "@/components/custom/contact-whatsapp-widget"
import { Button } from "@/components/ui/button"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { getBlurPlaceholder } from "@/lib/optimize-image"
import { services } from "@/schemas/contact"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `الحصـــــــــاد | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

// Force static generation
export const dynamic = "force-static"
export const revalidate = false
export const fetchCache = "force-cache"
export const runtime = "nodejs"

export default async function Harvest() {
  const imagePath = "/our-services/harvest.webp"
  const blurImage = await getBlurPlaceholder({ imageSrc: imagePath })

  const serviceIndex = 2

  return (
    <main className="flex min-h-full flex-col items-center -mb-22">
      <ContactWhatsAppWidget />
      <h1 className="mt-10 text-2xl select-none">موسم الحصاد</h1>

      <div className="flex w-full flex-col items-center">
        <div className="relative mt-12 w-full min-w-screen">
          <div className="relative flex min-h-[38rem] items-center">
            <Image
              src={imagePath}
              width={1200}
              height={800}
              alt="موسم الحصاد"
              className="absolute h-full w-full object-cover"
              placeholder="blur"
              blurDataURL={blurImage ?? undefined}
              priority
            />

            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div className="relative py-12">
              <div className="flex flex-col items-center justify-center gap-y-7">
                <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                  <p className="px-5 text-right text-lg leading-10 text-white md:w-1/2 md:px-10 md:leading-12">
                    في المرحلة الأخيرة من العملية الزراعية، يتم تنفيذ الحصاد بمشاركة فريق عمل يتراوح
                    عدده بين 10 إلى 50 فردًا، وذلك وفقًا لمساحة الأرض المزروعة. يُقسم الفريق إلى
                    مجموعات متخصصة في الحصاد، النقل، والتعبئة، حيث تُستخدم الأدوات اليدوية كجزء
                    أساسي من العملية، إلى جانب الاعتماد على الآليات الحديثة في عمليات التعبئة
                    والحصاد لتحسين الكفاءة وتقليل الجهد اليدوي.
                  </p>

                  <p className="px-5 text-right text-lg leading-10 text-white md:w-1/2 md:px-10 md:leading-12">
                    على الرغم من اتباع أساليب متطورة، يبقى هناك معدل فاقد يتراوح بين 5% إلى 8% نتيجة
                    التأخير في الحصاد أو النقل وسوء التخزين. لا يمكن تحديد الإنتاج بدقة مطلقة، إلا
                    أنه يمكن تحسين التقديرات باستخدام تقنيات حديثة مثل جمع عينات عشوائية من المزرعة
                    أو مراجعة بيانات الإنتاج السابقة، مما يحقق دقة تقديرية تتراوح بين 86% و90%.
                  </p>
                </div>
                <Link className="my-5 text-xl" href={`/contact?service=${services[serviceIndex]}`}>
                  <Button variant={"pressable"} className="px-12">
                    طلب الخــدمة
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
