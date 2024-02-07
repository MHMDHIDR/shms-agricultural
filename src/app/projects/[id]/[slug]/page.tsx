import Layout from '@/components/custom/Layout'
import Modal from '@/components/custom/Modal'
import { PercentageSlider } from '@/components/custom/PercentageSlider'
import ProjectImages from '@/components/custom/projectsImages'
import { API_URL, APP_LOGO } from '@/data/constants'
import { arabicDate, getProjectStudyCase } from '@/lib/utils'
import type { ProjectProps, imgsProps } from '@/types'
import axios from 'axios'
import { BadgeDollarSign, LineChart, MapPin, TimerIcon, TimerReset } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectDetailsPage({
  params: { id: projectId }
}: {
  params: { id: string }
}) {
  const {
    data: { project }
  }: { data: { project: ProjectProps } } = await axios.get(
    `${API_URL}/projects/get/${projectId}`
  )

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
        <p
          style={{ fontWeight: 'bold' }}
          className='leading-loose text-justify'
          dir='rtl'
        >
          {project.shms_project_description}
        </p>

        <div dir='rtl' className='grid grid-cols-3 grid-rows-3 gap-4 w-full my-10'>
          <div className='flex items-center flex-col gap-y-2 rtl'>
            <MapPin className='w-24 h-24 stroke-red-500 stroke-1' />
            <span>الموقع</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {project.shms_project_location}
            </p>
          </div>

          <div />

          <div className='flex items-center flex-col gap-y-2 rtl'>
            <BadgeDollarSign className='w-24 h-24 stroke-green-500 stroke-1' />
            <span>قيمة السهم الواحد</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {project.shms_project_stock_price}
            </p>
          </div>

          <div />

          <div className='flex items-center flex-col gap-y-2 rtl'>
            <LineChart className='w-20 h-20' />
            <span>ارباح السهم الواحد</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {project.shms_project_stock_profits}
            </p>
          </div>

          <div />

          <div className='flex items-center flex-col gap-y-2 rtl'>
            <TimerReset className='w-20 h-20' />
            <span>مدة المشروع</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {project.shms_project_location}
            </p>
          </div>

          <div />

          <div className='flex items-center flex-col gap-y-2 m-5 mt-10 rtl'>
            <TimerIcon className='w-20 h-20' />
            <span>موعد تسليم الأرباح</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {
                arabicDate(String(project.shms_project_profits_collect_date)).split(
                  'في'
                )[0]
              }
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
