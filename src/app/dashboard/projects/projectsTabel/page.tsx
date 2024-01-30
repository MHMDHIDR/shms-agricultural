'use client'

import Confirm from '@/components/custom/Confirm'
import { Error, Success } from '@/components/icons/Status'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
// import { ReloadIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { arabicDate, cn, getProjectStatus } from '@/lib/utils'
import type { ProjectProps } from '@/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ProjectsTable() {
  const [projects, setProjects] = useState<ProjectProps[]>([])
  const [projectDeleted, setProjectDeleted] = useState<number>(0)
  // const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  // const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  const getProjects = async () => {
    const { data: projects }: { data: ProjectProps[] } = await axios.get(
      `${API_URL}/projects/get`
    )
    setProjects(projects)
  }

  useEffect(() => {
    getProjects()
  }, [projectDeleted])

  const deleteProject = async (projectId: string) => {
    try {
      // setIsSubmittingForm(true)
      // delete project from database
      const { data }: { data: ProjectProps } = await axios.delete(
        `${API_URL}/projects/delete/${projectId}`
      )

      // delete user document from s3 bucket
      const {
        data: { docDeleted }
      }: { data: { docDeleted: boolean } } = await axios.delete(
        decodeURI(`${API_URL}/deleteFromS3/${projectId}`)
      )

      // make sure to view the response from the data
      if (data.projectDeleted === 1 && docDeleted) {
        toast(data.message ?? 'تم حذف المشروع بنجاح 👍🏼', {
          icon: <Success className='w-6 h-6 ml-3' />,
          position: 'bottom-center',
          className: 'text-right select-none rtl',
          duration: DEFAULT_DURATION,
          style: {
            backgroundColor: '#F0FAF0',
            color: '#367E18',
            border: '1px solid #367E18',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
        // setIsDoneSubmitting(true)
      } else {
        toast('حدث خطأ ما أثناء حذف المشروع', {
          icon: <Error className='w-6 h-6 ml-3' />,
          position: 'bottom-center',
          className: 'text-right select-none rtl',
          style: {
            backgroundColor: '#FFF0F0',
            color: '#BE2A2A',
            border: '1px solid #BE2A2A',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
        // setIsDoneSubmitting(false)
      }

      setProjectDeleted(data.projectDeleted ?? 0)
    } catch (error) {
      toast('حدث خطأ ما أثناء حذف المشروع', {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl',
        style: {
          backgroundColor: '#FFF0F0',
          color: '#BE2A2A',
          border: '1px solid #BE2A2A',
          gap: '1.5rem',
          textAlign: 'justify'
        }
      })
      console.error('Error =>', error)
    }
    // finally {
    //   setIsSubmittingForm(false)
    // }
  }

  return (
    <Table className='min-w-full text-center divide-y divide-gray-200'>
      <TableHeader>
        <TableRow>
          <TableHead className='select-none text-center font-bold'>اسم المشروع</TableHead>
          <TableHead className='select-none text-center font-bold'>
            منطقة المشروع
          </TableHead>
          <TableHead className='select-none text-center font-bold'>تاريخ البدء</TableHead>
          <TableHead className='select-none text-center font-bold'>
            تاريخ الانتهاء
          </TableHead>
          <TableHead className='select-none text-center font-bold'>
            اخر موعد للمساهمة
          </TableHead>
          <TableHead className='select-none text-center font-bold'>
            عدد الأسهم المتاحة
          </TableHead>
          <TableHead className='select-none text-center font-bold'>
            سعر السهم الواحد
          </TableHead>
          <TableHead className='select-none text-center font-bold'>أرباح السهم</TableHead>
          <TableHead className='select-none text-center font-bold'>
            حالة المشروع
          </TableHead>
          <TableHead className='select-none text-center font-bold'>العمليات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!projects || projects.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} className='space-y-6'>
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
            </TableCell>
          </TableRow>
        ) : (
          projects.map(project => (
            <TableRow key={project.shms_project_id}>
              <TableCell className='min-w-40'>{project.shms_project_name}</TableCell>
              <TableCell className='min-w-40'>{project.shms_project_location}</TableCell>
              <TableCell className='min-w-40'>
                {getProjectDate(project.shms_project_start_date)}
              </TableCell>
              <TableCell className='min-w-40'>
                {getProjectDate(project.shms_project_end_date)}
              </TableCell>
              <TableCell className='min-w-40'>
                {getProjectDate(project.shms_project_invest_date)}
              </TableCell>
              <TableCell className='min-w-40'>
                {project.shms_project_available_stocks}
              </TableCell>
              <TableCell className='min-w-40'>
                {project.shms_project_stock_price}
              </TableCell>
              <TableCell className='min-w-40'>
                {project.shms_project_stock_profits}
              </TableCell>
              <TableCell
                className={cn(
                  'min-w-40',
                  project.shms_project_status === 'active'
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {getProjectStatus(project.shms_project_status)}
              </TableCell>
              <TableCell className='flex min-w-56 gap-x-2'>
                <Confirm
                  variant={'destructive'}
                  onClick={async () => {
                    await deleteProject(project.shms_project_id)
                  }}
                  // className={
                  //   isDoneSubmitting
                  //     ? 'pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed'
                  //     : ''
                  // }
                >
                  حذف
                  {/* {isSubmittingForm ? (
                    <>
                      <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                      حذف
                    </>
                  ) : isDoneSubmitting ? (
                    <>
                      <Success className='ml-2' />
                      حذف
                    </>
                  ) : (
                    'حذف'
                  )} */}
                </Confirm>
                <Link
                  href={'/dashboard/project/' + project.shms_project_id}
                  // as={'/dashboard/project/' + project.shms_project_id}
                >
                  <Button variant={'outline'}>تعديل المشروع</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

/**
 * A function to get the project date in arabic
 * @param {Date} date
 * @returns {string} arabic date
 */
function getProjectDate(date: Date): string {
  return arabicDate(String(date)).split('في')[0]?.trim() ?? 'غير معروف'
}
