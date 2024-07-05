'use client'

import Modal from '@/components/custom/modal'
import { APP_LOGO, MOBILE_SCREEN, WINDOW_WIDTH } from '@/data/constants'
import { getProjectStudyCase } from '@/libs/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Projects } from '@prisma/client'

export default function ShowCaseStudy({ project }: { project: Projects }) {
  const [onMobileScreen, setOnMobileScreen] = useState(false)
  useEffect(() => {
    setOnMobileScreen(WINDOW_WIDTH < MOBILE_SCREEN)
  }, [])

  return onMobileScreen ? (
    <Link
      href={getProjectStudyCase(project.shms_project_study_case)}
      target='_blank'
      className='p-4 mt-10 text-white bg-green-500 rounded-lg hover:bg-green-700'
    >
      عرض دراسة الجدوى
    </Link>
  ) : (
    <Modal
      title={`دراسة الجدوى ${project.shms_project_name}`}
      document={getProjectStudyCase(project.shms_project_study_case) ?? APP_LOGO}
      className='mb-20 font-bold dark:text-white'
      contentClassName='min-w-[95svw] min-h-[90svh]'
    >
      عرض دراسة الجدوى
    </Modal>
  )
}
