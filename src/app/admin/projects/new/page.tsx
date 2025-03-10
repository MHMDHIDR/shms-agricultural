import { ProjectForm } from "./project-form"

export default function NewProjectPage() {
  return (
    <section className="container mx-auto max-w-4xl pb-10">
      <h1 className="my-10 text-center text-xl font-bold select-none">إضافة مشروع جديد</h1>
      <ProjectForm />
    </section>
  )
}
