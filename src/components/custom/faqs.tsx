import { unstable_cache } from "next/cache"
import LoadMore from "@/components/custom/load-more"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { createCaller } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import type { Faq } from "@prisma/client"

export default async function FAQ({ pathname }: { pathname: "/faqs" | "/" }) {
  const context = await createTRPCContext({ headers: new Headers() })
  const caller = createCaller(context)

  const getFaqData = unstable_cache(
    async () => {
      const data = await caller.faq.getAll()
      return data
    },
    ["faqs-data"],
    {
      revalidate: 3600,
      tags: ["faqs"],
    },
  )

  const { faqs, count } = await getFaqData()
  const RENDER_LIMIT = 5
  const FAQS_TO_RENDER = pathname.includes("/faqs") ? count : RENDER_LIMIT

  return (
    <section className="container mx-auto overflow-clip px-4 py-20 md:max-w-[70rem] md:px-0">
      {count > 0 && (
        <>
          <h2 className="mb-4 text-center text-2xl font-semibold select-none md:mb-14">
            الأسئلة الشائعة
          </h2>
          {faqs.slice(0, FAQS_TO_RENDER).map((item: Faq, index: number) => (
            <Accordion key={index} type="single" collapsible>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="focus-within:text-foreground/60 cursor-pointer hover:text-foreground/60 dark:focus-within:text-secondary-foreground dark:hover:text-secondary-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-loose">{item.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
          {count > FAQS_TO_RENDER && (
            <div className="mt-12 flex justify-center">
              <LoadMore href="/faqs" />
            </div>
          )}
        </>
      )}
    </section>
  )
}
