import { api } from "@/trpc/server"
import ProfitsPercentageForm from "./profits-percentage-form"
import ProfitsPercentageTable from "./profits-percentage-table"

export default async function ProfitsPercentagePage() {
  const { projects } = await api.projects.getAll()

  return (
    <section className="container mx-auto my-10">
      <h1 className="text-center text-xl font-bold select-none">إدارة نسب الأرباح</h1>
      <ProfitsPercentageForm projects={projects} />
      <ProfitsPercentageTable projects={projects} />
    </section>
  )
}
