import { notFound, redirect } from "next/navigation"
import { ProjectStepper } from "@/components/custom/projects/stepper"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
import { api } from "@/trpc/server"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>
}): Promise<Metadata> {
  const { projectId } = await params
  const project = await api.projects.getProjectById({ projectId })

  return {
    title: `مشروع ${project?.projectName} | ${APP_TITLE}`,
    description: APP_DESCRIPTION,
  }
}

export async function generateStaticParams(): Promise<{ projectId: string }[]> {
  try {
    const projects = await db.projects.findMany({
      select: { id: true },
    })

    return projects.map(project => ({
      projectId: project.id,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return [] // Return empty array as fallback
  }
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const session = await auth()
  const { projectId } = await params
  const project = await api.projects.getProjectById({ projectId })
  if (!project) notFound()

  const searchParamsProp = await searchParams
  const { step } = searchParamsProp
  const currentStep = step ?? "info"

  // Check authentication only for purchase and confirm steps
  if ((currentStep === "purchase" || currentStep === "confirm") && !session?.user) {
    const callbackUrl = encodeURIComponent(`/projects/${projectId}?step=${currentStep}`)
    redirect(`/signin?callbackUrl=${callbackUrl}`)
  }

  return (
    <div className="container mx-auto py-8">
      <ProjectStepper project={project} currentStep={currentStep} projectId={projectId} />
    </div>
  )
}
