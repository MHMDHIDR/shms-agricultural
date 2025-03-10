import { api } from "@/trpc/server"
import FaqForm from "./faq-form"
import FaqTable from "./faq-table"

export default async function FaqPage() {
  const { faqs } = await api.faq.getAll()

  return (
    <section className="container mx-auto">
      <h1 className="my-10 text-center text-xl font-bold select-none">الأسئلة الشائعة</h1>
      <FaqForm />
      <FaqTable initialFaqs={faqs} />
    </section>
  )
}
