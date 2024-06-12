import Layout from '@/components/custom/Layout'
import { PercentageSlider } from '@/components/custom/PercentageSlider'
import ProjectImages from '@/components/custom/projectsImages'
import { APP_DESCRIPTION, APP_TITLE } from '@/data/constants'
import {
  arabicDate,
  formattedPrice,
  getProject,
  getProjectDuration,
  getProjectStudyCase,
  removeSlug
} from '@/libs/utils'
import { BadgeDollarSign, LineChart, MapPin, TimerIcon, TimerReset } from 'lucide-react'
import Link from 'next/link'
import type { imgsProps } from '@/types'
import ShowCaseStudy from './_ShowCaseStudy'

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
          className='container text-justify leading-10'
          dir='rtl'
        >
          {project.shms_project_description}
        </p>

        <div
          dir='rtl'
          className='w-full my-10 grid grid-cols-3 grid-rows-3 place-items-center'
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
              {formattedPrice(project.shms_project_stock_price, 0)}
            </p>
          </div>

          <div />

          <div className='flex flex-col items-center text-center gap-y-1 rtl'>
            <LineChart className='w-20 h-20 stroke-1' />
            <span>ارباح السهم الواحد</span>
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              {formattedPrice(project.shms_project_stock_profits, 0)}
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

        {project.shms_project_study_case_visibility &&
        getProjectStudyCase(project.shms_project_study_case) ? (
          <ShowCaseStudy project={project} />
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
