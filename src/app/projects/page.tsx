import { APP_DESCRIPTION, APP_TITLE } from '@/data/constants'
import { Metadata } from 'next'
import Layout from '@/components/custom/Layout'
import NoRecords from '@/components/custom/NoRecords'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { API_URL, APP_LOGO } from '@/data/constants'
import { createSlug } from '@/libs/utils'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { getAuth } from '@/libs/actions/auth'
import type { Projects } from '@prisma/client'

export const metadata: Metadata = {
  title: `مشاريعنا الاستثمارية | ${APP_TITLE}
}`,
  description: APP_DESCRIPTION
}

export default async function ProjectsPage() {
  let { data: projects }: { data: Projects[] } = await axios.get(
    `${API_URL}/projects/get`
  )
  const { userType } = await getAuth()

  // if project.shms_project_status do not render the page, only the admin can see it, otherwise trigger a 404 error notFound()
  if (userType !== 'admin') {
    projects = projects.filter(project => project.shms_project_status === 'active')
  }

  const isOneProject =
    projects.filter(project => project.shms_project_status === 'active').length === 1

  return (
    <Layout>
      <main className='flex flex-col items-center min-h-screen pt-24'>
        <h1 className='mb-10 text-center md:text-lg lg:text-2xl md:font-bold'>
          المشاريع الاستثمارية
        </h1>
        {!projects || projects.length === 0 ? (
          <NoRecords links={[{ to: `/`, label: 'الصفحة الرئيسية' }]} />
        ) : (
          <div className='justify-end grid grid-cols-1 gap-4 md:grid-cols-2 rtl'>
            {projects.map((project, index) => (
              <Link
                href={`projects/${project.id}/${createSlug(project.shms_project_name)}`}
                key={index}
                className={`block hover:-translate-y-3 transition-transform duration-300 rtl overflow-clip${
                  isOneProject ? ' col-span-full' : ''
                }`}
              >
                <Card
                  className={`w-4/5 m-5 mx-auto max-w-screen-md min-w-72 overflow-hidden${
                    isOneProject ? ' w-full' : ''
                  }`}
                >
                  <CardContent className='relative flex flex-col p-0 shadow-md gap-y-2'>
                    {userType === 'admin' ? (
                      <span
                        className={`absolute top-20 -left-4 text-white text-center px-14 py-1 transform -rotate-45 origin-top-left text-xs font-bold z-10 ${
                          project.shms_project_status === 'active'
                            ? 'bg-green-600'
                            : 'bg-red-600'
                        }`}
                      >
                        {project.shms_project_status === 'active' ? 'مفعل' : 'غير مفعل'}
                      </span>
                    ) : null}
                    <Image
                      key={project.id}
                      src={project.shms_project_images[0]?.imgDisplayPath ?? APP_LOGO}
                      priority={true}
                      alt={`Project ${index + 1}`}
                      width={400}
                      height={250}
                      className='object-cover w-full h-56 rounded-lg cursor-pointer md:h-72'
                    />
                    <CardDescription className='flex flex-col pb-2 mx-3 md:mx-6 gap-y-2 md:gap-y-4'>
                      <span className='text-sm transition-colors md:font-bold w-fit hover:text-green-500 md:text-lg'>
                        {project.shms_project_name}
                      </span>
                      <span className='text-sm md:font-bold md:text-lg'>
                        <strong>{project.shms_project_location}</strong>
                      </span>
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </Layout>
  )
}
