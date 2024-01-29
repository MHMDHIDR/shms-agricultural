import Layout from '@/components/custom/Layout'
import NoRecords from '@/components/custom/NoRecords'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { API_URL, APP_LOGO } from '@/data/constants'
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
        <h1 className='text-center md:text-lg lg:text-2xl'>المشاريع الاستثمارية</h1>

        {!projects || projects.length === 0 ? (
          <NoRecords links={[{ to: `/`, label: 'الصفحة الرئيسية' }]} />
        ) : (
          <div className='grid justify-end grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 rtl'>
            {projects.map((project, index) => (
              <Card
                className='w-4/5 max-w-screen-md m-5 mx-auto min-w-72 rtl'
                key={index}
              >
                <CardContent className='flex flex-col p-0 shadow-md gap-y-6'>
                  <Link href={`projects/${project.shms_project_id}`}>
                    <Image
                      key={project.shms_project_id}
                      src={
                        JSON.parse(project.shms_project_images)[0]?.imgDisplayPath ??
                        APP_LOGO
                      }
                      priority={true}
                      alt={`Project ${index + 1}`}
                      width={950}
                      height={950}
                      className='rounded-lg cursor-pointer'
                    />
                  </Link>

                  <CardDescription className='pb-4 mx-3 space-y-2 md:space-y-4'>
                    <h2 className='text-sm md:font-bold w-fit md:underline-hover md:text-lg'>
                      <Link href={`projects/${project.shms_project_id}`}>
                        {project.shms_project_name}
                      </Link>
                    </h2>
                    <span className='inline-block text-sm md:font-bold md:text-lg'>
                      <strong>{project.shms_project_location}</strong>
                    </span>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </Layout>
  )
}
