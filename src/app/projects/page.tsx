import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import Layout from '@/components/custom/Layout'

const projects = [
  {
    id: 1,
    images: [
      'https://cdn.wikifarmer.com/wp-content/uploads/2022/07/%D9%85%D8%A7-%D9%87%D9%8A-%D8%A7%D9%84%D8%B2%D8%B1%D8%A7%D8%B9%D8%A9-%D8%A7%D9%84%D8%A3%D8%AD%D8%A7%D8%AF%D9%8A%D8%A9.jpg',
      '',
      ''
    ],
    name: 'المشروع الاول 2024',
    area: 'الابيض'
  },
  {
    id: 2,
    images: [
      'https://modo3.com/thumbs/fit630x300/123/1348062273/%D8%AA%D8%B9%D8%B1%D9%8A%D9%81_%D8%A7%D9%84%D8%B2%D8%B1%D8%A7%D8%B9%D8%A9.jpg',
      '',
      ''
    ],
    name: ' المشروع الثاني 2023',
    area: 'شندي'
  }
]

export default function Projects() {
  return (
    <Layout>
      <main className='flex min-h-screen flex-col items-center justify-between p-24'>
        <h1 className='text-3xl'>المشاريع الاستثمارية </h1>

        {projects.map((project, index) => (
          <Card
            style={{ margin: 10, width: '80%' }}
            key={index}
            dir='rtl'
            className='project-card'
          >
            <CardContent className='project-content'>
              <Link href={`projects/${project.id}`}>
                <Image
                  key={index}
                  src={project.images[0]!}
                  priority={true}
                  alt={`Project ${index + 1}`}
                  width={300}
                  height={300}
                  style={{ marginTop: 20, cursor: 'pointer' }}
                  className='project-image'
                />
                <p style={{ margin: 20 }}>اسم المشروع: {project.name}</p>
              </Link>

              <p style={{ margin: 20 }}>منطقة المشروع: {project.area}</p>
            </CardContent>
          </Card>
        ))}
      </main>
    </Layout>
  )
}
