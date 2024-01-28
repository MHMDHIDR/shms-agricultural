import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import Layout from '@/components/custom/Layout'
import { API_URL, APP_LOGO } from '@/data/constants'
import { ProjectProps } from '@/types'
import NoRecords from '@/components/custom/NoRecords'

export default async function Projects() {
  const { data: projects }: { data: ProjectProps[] } = await axios.get(
    `${API_URL}/projects/get`
  )

  return (
    <Layout>
      <main className='flex flex-col items-center min-h-screen p-24'>
        <h1 className='text-3xl'>المشاريع الاستثمارية </h1>

        {!projects || projects.length === 0 ? (
          <NoRecords links={[{ to: `/`, label: 'الصفحة الرئيسية' }]} />
        ) : (
          projects.map((project, index) => (
            <Card
              style={{ margin: 10, width: '80%' }}
              key={index}
              dir='rtl'
              className='project-card'
            >
              <CardContent className='project-content'>
                <Link href={`projects/${project.shms_project_id}`}>
                  <Image
                    key={project.shms_project_id}
                    src={project.shms_project_images[0]?.imgDisplayPath ?? APP_LOGO}
                    priority={true}
                    alt={`Project ${index + 1}`}
                    width={300}
                    height={300}
                    className='mt-5 cursor-pointer project-image'
                  />
                  <p style={{ margin: 20 }}>اسم المشروع: {project.shms_project_name}</p>
                </Link>

                <p style={{ margin: 20 }}>
                  منطقة المشروع: {project.shms_project_location}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </Layout>
  )
}
