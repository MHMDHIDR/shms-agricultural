import Layout from '@/components/custom/Layout'
import Modal from '@/components/custom/Modal'
import { PercentageSlider } from '@/components/custom/PercentageSlider'
import ProjectImages from '@/components/custom/projectsImages'
import { API_URL, APP_LOGO } from '@/data/constants'
import { getProjectStudyCase } from '@/lib/utils'
import type { ProjectProps, imgsProps } from '@/types'
import axios from 'axios'
import Link from 'next/link'

export default async function ProjectDetailsPage({
  params: { id: projectId /*, slug*/ }
}: {
  params: { id: string /*, slug: string*/ }
}) {
  const {
    data: { project }
  }: { data: { project: ProjectProps } } = await axios.get(
    `${API_URL}/projects/get/${projectId}`
  )

  // to get decoded slug from url ==> onst projectSlug = decodeURI(slug)

  const getProjectImages: imgsProps['imgDisplayPath'][] =
    project.shms_project_images &&
    JSON.parse(String(project.shms_project_images)).map(
      ({ imgDisplayPath }: imgsProps) => imgDisplayPath
    )

  const getProjectCompletedPercentage = (available: number, total: number) => {
    return (
      Number(
        Math.min(
          // it will return the minimum value between the two values
          Math.round(
            100 - (available / total) * 100 < 100
              ? 100 - (available / total) * 100 + 1
              : 100 - (available / total) * 100
          ),
          100
        )
      ) || 0
    ) // 0 is a fallback value
  }

  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen sm:p-24'>
        <h1 className='mb-10 text-2xl font-bold text-center select-none' dir='rtl'>
          {project.shms_project_name}
        </h1>
        {/* Render images in a row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <ProjectImages images={getProjectImages} />
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
                className='w-8 h-8 text-red-500'
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
                className='w-8 h-8 text-black'
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
                className='w-8 h-8 text-red-500'
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
                className='w-8 h-8 text-green-500'
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
          {project.shms_project_study_case_visibility ? (
            <div style={{ width: '50%', backgroundColor: 'gray' }}>
              <div style={{ margin: 20 }} dir='rtl' className='flex items-center'>
                <Modal
                  title={`دراسة الجدوى ${project.shms_project_name}`}
                  document={
                    getProjectStudyCase(project.shms_project_study_case) ?? APP_LOGO
                  }
                  className='font-bold dark:text-white'
                  contentClassName='min-w-[90svw]'
                >
                  عرض دراسة الجدوى
                </Modal>
              </div>
            </div>
          ) : null}
        </div>

        {/*  نسبة إكتمال المشروع */}
        <p className='font-bold select-none'>نسبة إكتمال المشروع</p>
        <PercentageSlider
          // 1 تم إضافته لتجنب القيمة الصفرية  للنسبة المئوية و لعدم إظهار النسبة بشكل حقيقي
          value={[
            getProjectCompletedPercentage(
              project.shms_project_available_stocks,
              project.shms_project_total_stocks
            )
          ]}
        />

        {/* زر شراء السهم */}
        <Link
          href={`/projects/${projectId}/buy`}
          className='p-4 mt-10 text-white bg-green-500 rounded-lg hover:bg-green-700'
        >
          شراء أسهم من المشروع
        </Link>
      </main>
    </Layout>
  )
}
