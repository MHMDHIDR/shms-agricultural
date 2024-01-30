import Layout from '@/components/custom/Layout'
import { API_URL } from '@/data/constants'
import type { ProjectProps } from '@/types'
import axios from 'axios'

export default async function ProjectDetailsPage({
  params: { id: projectId /*, slug*/ }
}: {
  params: { id: string /*, slug: string*/ }
}) {
  const {
    data: { project }
  }: { data: { project: ProjectProps } } = await axios.get(
    `${API_URL}/projects/${projectId}`
  )

  // const projectSlug = decodeURI(slug)

  const projectImages: Array<{
    imgDisplayName: string
    imgDisplayPath: string
  }> = JSON.parse(project.shms_project_images)

  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen sm:p-24'>
        {/* Render images in a row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {projectImages.map((image, index) => (
            <img
              key={index}
              src={image.imgDisplayPath}
              alt={image.imgDisplayName}
              width={300}
              height={300}
              style={{ margin: 20, borderRadius: 10 }}
            />
          ))}
        </div>
        <p style={{ fontWeight: 'bold' }} dir='rtl'>
          {project.shms_project_description}
        </p>
        <div
          dir='rtl'
          className='flex items-center'
          style={{ backgroundColor: 'black', width: '100%', margin: 20 }}
        >
          <div style={{ width: '50%', backgroundColor: 'pink' }}>
            <div style={{ margin: 20 }} dir='rtl' className='flex items-center'>
              <svg
                className='h-8 w-8 text-red-500'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                <circle cx='12' cy='10' r='3' />
              </svg>
              <p> الموقع : </p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                {project.shms_project_location}
              </p>
            </div>

            <div
              style={{ margin: 20, marginTop: 40 }}
              dir='rtl'
              className='flex items-center'
            >
              <svg
                className='h-8 w-8 text-black'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p> قيمة السهم الواحد : </p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                {project.shms_project_stock_price}
              </p>
            </div>
          </div>

          <div style={{ width: '50%', backgroundColor: 'gray' }}>
            <div style={{ margin: 20 }} dir='rtl' className='flex items-center'>
              <svg
                className='h-8 w-8 text-red-500'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                <circle cx='12' cy='10' r='3' />
              </svg>
              <p> مدة المشروع : </p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                {project.shms_project_location}
              </p>
            </div>

            <div
              style={{ margin: 20, marginTop: 40 }}
              dir='rtl'
              className='flex items-center'
            >
              <svg
                className='h-8 w-8 text-green-500'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
              </svg>
              <p> ارباح السهم الواحد : </p>
              <p style={{ color: 'green', fontWeight: 'bold' }}>
                {project.shms_project_stock_profits}
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
