"use client"

import { motion } from "framer-motion"

export default function OurValues() {
  return (
    <section className="container mx-auto overflow-clip px-4 py-20 md:max-w-[70rem] md:px-0">
      <div className="flex flex-col justify-center gap-7 text-center">
        <h2 className="text-2xl font-semibold">رؤيتنا</h2>
        <p className="text-muted-foreground dark:text-secondary-foreground text-sm leading-loose! md:text-base">
          أن يكون السودان هو فعلياً سلة غذاء العالم وأن يكون رائداً بين الدول العربية في مجال
          الزراعة وتطوير الأدوات الزراعية وتحسين جودة المزروعات، مما يسهم بشكل كبير في النمو
          الاقتصادي للفرد وللدولة على حد سواء. كما نسعى إلى تحقيق الاستدامة الزراعية وتعزيز الابتكار
          في التقنيات الزراعية، مع دعم المجتمعات المحلية لخلق بيئة زراعية متطورة ومستدامة.
        </p>
      </div>
      <div className="mt-14 grid max-w-(--breakpoint-lg) grid-cols-1 items-center gap-10 md:grid-cols-2 lg:px-16">
        {[
          {
            title: "روح الفريق",
            text: "نحن نؤمن بأن العمل الجماعي هو مفتاح النجاح في الزراعة. بتكاتف الجهود بين المزارعين والخبراء، نحقق أقصى درجات الكفاءة ونضمن استدامة الإنتاج الزراعي.",
          },
          {
            title: "الابتكار",
            text: "نستخدم أحدث التقنيات الزراعية لضمان أفضل إنتاجية وجودة. نستثمر في البحث والتطوير لنكون دائماً في طليعة التحول الرقمي في المجال الزراعي.",
          },
          {
            title: "الجودة",
            text: "نلتزم بأعلى معايير الجودة في جميع مراحل الزراعة، من زراعة البذور إلى الحصاد، مما يضمن إنتاج محاصيل صحية ومستدامة.",
          },
          {
            title: "الاستقلالية",
            text: "نحن نعتمد على مواردنا الطبيعية والبشرية بكفاءة عالية، مما يجعلنا قادرين على تحقيق الاكتفاء الذاتي وتقليل الاعتماد على الاستيراد.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between gap-10 lg:flex-row"
          >
            <motion.div
              className="flex gap-4 lg:max-w-md"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="to-primary h-20 w-[3px] bg-linear-to-b from-transparent opacity-70"></span>
                <span className="bg-muted/50 flex size-10 items-center justify-center rounded-full border font-mono text-lg select-none">
                  {index + 1}
                </span>
                <span className="from-primary h-20 w-[3px] bg-linear-to-b to-transparent opacity-70"></span>
              </div>
              <div className="flex flex-col justify-center gap-5 px-4 py-4">
                <h3 className="text-xl lg:text-2xl">{item.title}</h3>
                <p className="text-muted-foreground dark:text-secondary-foreground text-justify text-sm lg:text-base">
                  {item.text}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}
