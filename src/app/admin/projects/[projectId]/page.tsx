import { notFound } from "next/navigation"
import { api } from "@/trpc/server"
import { ProjectForm } from "../new/project-form"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const project = await api.projects.getProjectById({ projectId })

  return !project ? (
    notFound()
  ) : (
    <div className="container mx-auto max-w-4xl pb-10">
      <h1 className="my-10 text-center text-xl font-bold select-none">تعديل المشروع</h1>
      <ProjectForm project={project} isEditing />
    </div>
  )
}
