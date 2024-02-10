import Layout from '@/components/custom/Layout'
import Modal from '@/components/custom/Modal'
import { PercentageSlider } from '@/components/custom/PercentageSlider'
import ProjectImages from '@/components/custom/projectsImages'
import { APP_DESCRIPTION, APP_LOGO, APP_TITLE } from '@/data/constants'
import {
  arabicDate,
  getProject,
  getProjectDuration,
  getProjectStudyCase,
  removeSlug
} from '@/lib/utils'
import { BadgeDollarSign, LineChart, MapPin, TimerIcon, TimerReset } from 'lucide-react'
import Link from 'next/link'
import type { imgsProps } from '@/types'

export async function generateMetadata({
  params: { id: projectId, slug }
}: {
  params: { id: string; slug: string }
}) {
  const project = await getProject(projectId)

  return {
    title: removeSlug(decodeURI(slug)) + ' | ' + APP_TITLE,
    description: project.shms_project_description || APP_DESCRIPTION
  }
}

//APP_TITLE, description: APP_DESCRIPTION }
export default async function ProjectDetailsPage({
  params: { id: projectId }
}: {
  params: { id: string }
}) {
  const project = await getProject(projectId)

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
      <main className='container flex flex-col items-center justify-between min-h-screen px-4 mt-40'>
        <h1 className='text-lg font-bold text-center select-none' dir='rtl'>
          {project.shms_project_name}
        </h1>
        {/* Render images in a row */}
        <ProjectImages images={getProjectImages} />
        <p
          style={{ fontWeight: 'bold' }}
          className='leading-loose text-justify'
          dir='rtl'
        >
          {project.shms_project_description}
        </p>

        <div
          dir='rtl'
          className='grid w-full grid-cols-3 grid-rows-3 my-10 place-items-center'
        >
          <div className='flex flex-col items-center text-center gap-y-1 rtl'>
            <MapPin className='w-20 h-20 stroke-1 stroke-red-500' />
            <span>الموقع</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {project.shms_project_location}
            </p>
          </div>

          <div />

          <div className='flex flex-col items-center text-center gap-y-1 rtl'>
            <BadgeDollarSign className='w-20 h-20 stroke-1 stroke-green-500' />
            <span>قيمة السهم الواحد</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {project.shms_project_stock_price}
            </p>
          </div>

          <div />

          <div className='flex flex-col items-center text-center gap-y-1 rtl'>
            <LineChart className='w-20 h-20 stroke-1' />
            <span>ارباح السهم الواحد</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {project.shms_project_stock_profits}
            </p>
          </div>

          <div />

          <div className='flex flex-col items-center text-center gap-y-1 rtl'>
            <TimerReset className='w-20 h-20 stroke-1' />
            <span>مدة المشروع</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {getProjectDuration(
                new Date(project.shms_project_start_date),
                new Date(project.shms_project_end_date)
              )}
            </p>
          </div>

          <div />

          <div className='flex flex-col items-center text-center gap-y-1 rtl'>
            <TimerIcon className='w-20 h-20 stroke-1' />
            <span>موعد تسليم الأرباح</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {
                arabicDate(String(project.shms_project_profits_collect_date))
                  .split('في')[0]
                  ?.split('،')[1]
              }
            </p>
          </div>
        </div>

        {project.shms_project_study_case_visibility ? (
          <Modal
            title={`دراسة الجدوى ${project.shms_project_name}`}
            document={getProjectStudyCase(project.shms_project_study_case) ?? APP_LOGO}
            className='mb-20 font-bold dark:text-white'
            contentClassName='min-w-[90svw]'
          >
            عرض دراسة الجدوى
          </Modal>
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
        {project.shms_project_available_stocks > 0 && (
          <Link
            href={`/projects/${projectId}/buy`}
            className={`p-4 mt-10 text-white bg-green-500 rounded-lg hover:bg-green-700${
              project.shms_project_available_stocks === 0
                ? ' cursor-not-allowed pointer-events-none opacity-50'
                : ''
            }`}
            aria-disabled={project.shms_project_available_stocks === 0}
          >
            شراء أسهم من المشروع
          </Link>
        )}
      </main>
    </Layout>
  )
}
