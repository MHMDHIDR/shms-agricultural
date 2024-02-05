import Layout from '@/components/custom/Layout'
import NoRecords from '@/components/custom/NoRecords'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { API_URL, APP_LOGO } from '@/data/constants'
import { createSlug } from '@/lib/utils'
import { ProjectProps } from '@/types'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

export default async function Projects() {
  const { data: projects }: { data: ProjectProps[] } = await axios.get(
    `${API_URL}/projects/get`
  )

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
            {projects
              .filter(project => project.shms_project_status === 'active')
              .map((project, index) => (
                <Link
                  href={`projects/${project.shms_project_id}/${createSlug(
                    project.shms_project_name
                  )}`}
                  key={index}
                  className='block hover:-translate-y-3 transition-transform duration-300 rtl overflow-clip'
                >
                  <Card className='w-4/5 m-5 mx-auto max-w-screen-md min-w-72'>
                    <CardContent className='flex flex-col p-0 shadow-md gap-y-6'>
                      <div>
                        <Image
                          key={project.shms_project_id}
                          src={
                            JSON.parse(String(project.shms_project_images))[0]
                              ?.imgDisplayPath ?? APP_LOGO
                          }
                          priority={true}
                          alt={`Project ${index + 1}`}
                          width={400}
                          height={200}
                          className='object-cover w-full h-40 rounded-lg cursor-pointer md:h-72'
                        />
                      </div>

                      <CardDescription className='flex flex-col pb-4 mx-3 md:mx-6 gap-y-2 md:gap-y-4'>
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
