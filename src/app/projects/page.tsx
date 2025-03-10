import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import NoRecords from "@/components/custom/no-records"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { APP_DESCRIPTION, APP_LOGO, APP_TITLE } from "@/lib/constants"
import { auth } from "@/server/auth"
import { api } from "@/trpc/server"
import EditButton from "./edit-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `مشاريعنا الاستثمارية | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export default async function ProjectsPage() {
  const session = await auth()
  const sessionRole = session?.user?.role

  const { projects, count, role } = await api.projects.getAll()
  const { count: investorsCount } = await api.user.getInvestors()

  return (
    <main className="flex min-h-screen flex-col items-center pt-8 md:pt-14">
      <h1 className="mb-10 text-center md:text-lg md:font-bold lg:text-2xl">
        المشاريع الاستثمارية
      </h1>
      {!projects || count === 0 ? (
        <NoRecords links={[{ to: `/`, label: "الصفحة الرئيسية" }]} />
      ) : (
        <div className="rtl grid grid-cols-1 justify-end gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <Link
              key={index}
              href={`projects/${project.id}`}
              className={clsx("rtl group block overflow-clip", { "col-span-full": count === 1 })}
            >
              <Card
                className={clsx(
                  "relative m-5 mx-auto w-4/5 max-w-screen-md min-w-72 overflow-clip rounded-lg shadow-md",
                  { "w-full": count === 1 },
                )}
              >
                <CardContent className="relative flex flex-col p-0">
                  {role === "admin" ? (
                    <span
                      className={`absolute top-20 -left-8 z-10 origin-top-left -rotate-45 transform px-14 py-1 text-center text-xs font-bold text-white ${
                        project.projectStatus === "active" ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {project.projectStatus === "active" ? "مفعل" : "غير مفعل"}
                    </span>
                  ) : null}
                  <div className="absolute top-0 w-full bg-gradient-to-t from-transparent via-black/50 to-black py-2 px-4">
                    <strong className="text-lime-500 text-xs md:text-sm">
                      إنضم إلى {investorsCount} من المستثمرين الناجحين
                    </strong>
                  </div>
                  <Image
                    key={project.id}
                    src={project.projectImages[0]?.imgDisplayPath ?? APP_LOGO}
                    priority={true}
                    alt={`Project ${index + 1}`}
                    width={400}
                    height={250}
                    className="h-56 w-full object-cover md:h-72"
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-[padding] group-hover:pb-6">
                    <CardDescription className="flex flex-col gap-y-0 text-white">
                      <strong className="w-fit text-sm transition-colors group-hover:text-green-500 md:text-base">
                        {project.projectName}
                      </strong>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-300 md:text-sm">
                          {project.projectLocation}
                        </span>
                        {sessionRole === "admin" && <EditButton projectId={project.id} />}
                      </div>
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
