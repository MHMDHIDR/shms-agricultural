import Image from "next/image"
import Link from "next/link"
import { getBlurPlaceholder } from "@/lib/optimize-image"
import { ServiceItem } from "./service-item"

const services = [
  {
    image: "/our-services/agricultural-investment.webp",
    title: "استثمار",
    text: "نوفر فرص استثمارية مستدامة تساهم في تطوير القطاع الزراعي وتحقيق النمو الاقتصادي.",
    href: "/projects",
  },
  {
    image: "/our-services/preparation.webp",
    title: "تحضير",
    text: "نضمن تحضير التربة واستخدام أفضل الأدوات والتقنيات الحديثة لبدء الزراعة بأفضل جودة.",
    href: "/preparation",
  },
  {
    image: "/our-services/farming.webp",
    title: "زراعة",
    text: "نستخدم أحدث الأساليب لضمان زراعة فعالة وإنتاج محاصيل ذات جودة عالية وصحية.",
    href: "/farming",
  },
  {
    image: "/our-services/harvest.webp",
    title: "حصاد",
    text: "نحرص على تنفيذ عمليات الحصاد بأعلى المعايير لضمان الحصول على أفضل إنتاج.",
    href: "/harvest",
  },
]

export async function Services() {
  const servicesWithBlur = await Promise.all(
    services.map(async service => ({
      ...service,
      blurDataURL: await getBlurPlaceholder({ imageSrc: service.image }),
    })),
  )

  return servicesWithBlur.map((service, index) => (
    <Link href={service.href} key={index} className="block">
      <ServiceItem index={index}>
        <Image
          src={service.image}
          alt={service.title}
          className="aspect-video w-full rounded-xl border border-dashed object-cover"
          width={400}
          height={200}
          quality={20}
          loading="lazy"
          placeholder="blur"
          blurDataURL={service.blurDataURL ?? undefined}
        />
        <div className="p-6">
          <h3 className="mb-1 text-2xl font-semibold">{service.title}</h3>
          <p className="text-muted-foreground dark:text-secondary-foreground">{service.text}</p>
        </div>
      </ServiceItem>
    </Link>
  ))
}
