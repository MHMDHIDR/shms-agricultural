import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Services } from "./services"

export default function OurServices({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto overflow-clip px-4 py-20 md:max-w-[70rem] md:px-0">
      <div className="relative grid gap-16 md:grid-cols-2">
        <div className="top-40 h-fit md:sticky">
          <h2 className="mt-4 mb-6 text-4xl font-semibold md:text-5xl">اختبر الفرق معنا</h2>
          <p className="text-muted-foreground dark:text-secondary-foreground font-medium md:text-xl">
            نحن نؤمن بإنشاء شراكات دائمة مع مستثمرينا مع التركيز على النجاح طويل الأمد من خلال
            الابتكار التعاوني والدعم المخصص.
          </p>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row">
            {children}
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-12 md:gap-20">
          <Services />
        </div>
      </div>
    </section>
  )
}
