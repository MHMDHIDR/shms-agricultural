import { api } from "@/trpc/server"
import ProjectsClientPage from "./projects.client"

export default async function ProjectsPage() {
  const { projects, count } = await api.projects.getAll()

  return (
    <section className="container mx-auto">
      <h1 className="my-10 text-center text-xl font-bold select-none">المشاريع</h1>

      <ProjectsClientPage projects={projects} count={count} />
    </section>
  )
}
