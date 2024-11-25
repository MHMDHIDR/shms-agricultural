'use client'

import Confirm from '@/components/custom/confirm'
import Modal from '@/components/custom/modal'
import NoRecords from '@/components/custom/no-records'
import { Error, Loading, Success } from '@/components/icons/status'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { cn, getProjectDate, getProjectStatus, scrollToView } from '@/libs/utils'
import type { Projects } from '@prisma/client'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { depositCapitalOrProfits, resetCredit } from './actions/handle-deposit'

export default function ProjectsTable() {
  const [projects, setProjects] = useState<Projects[]>([])
  const [projectDeleted, setProjectDeleted] = useState<number>(0)
  const [isPending, startTransition] = useTransition()
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(null)

  const { refresh } = useRouter()

  const getProjects = async () => {
    const { data: projects }: { data: Projects[] } = await axios.get(
      `${API_URL}/projects/get`
    )
    setProjects(projects)
  }

  useEffect(() => {
    getProjects()
  }, [projectDeleted])

  const deleteProject = async (projectId: string) => {
    try {
      const { data }: { data: Projects } = await axios.delete(
        `${API_URL}/projects/delete/${projectId}`
      )

      // delete user document from s3 bucket
      const {
        data: { docDeleted }
      }: { data: { docDeleted: boolean } } = await axios.delete(
        decodeURI(`${API_URL}/deleteFromS3/${projectId}`),
        { data: { imageId: `projects/${projectId}` } }
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
      }

      setProjectDeleted(data.projectDeleted ?? 0)
      setTimeout(() => refresh(), DEFAULT_DURATION)
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
  }

  const handleResetCredit = async (projectId: string) => {
    try {
      // Show loading toast immediately
      const loadingId = toast('جاري إعادة تعيين الرصيد', {
        icon: <Loading className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        duration: Infinity // Keep showing until we dismiss it
      })
      setLoadingToastId(loadingId)

      // Start transition for the reset operation
      startTransition(async () => {
        const result = await resetCredit(projectId)

        // Dismiss loading toast
        toast.dismiss(loadingId)
        setLoadingToastId(null)

        if (result.success) {
          toast(result.message, {
            icon: <Success className='w-6 h-6 ml-3' />,
            position: 'bottom-center',
            duration: DEFAULT_DURATION
          })
        } else {
          toast(result.message, {
            icon: <Error className='w-6 h-6 ml-3' />,
            position: 'bottom-center'
          })
        }
      })
    } catch (error) {
      // Dismiss loading toast if there's an error
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
        setLoadingToastId(null)
      }

      toast('حدث خطأ أثناء عملية إعادة التعيين', {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center'
      })
    }
  }

  const handleDeposit = async (
    depositType: 'capital' | 'profits',
    projectId: Projects['id']
  ) => {
    if (!depositType || !projectId) return

    try {
      const loadingId = toast('جاري عملية الإيداع', {
        icon: <Loading className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        duration: Infinity
      })
      setLoadingToastId(loadingId)

      startTransition(async () => {
        const result = await depositCapitalOrProfits(depositType, projectId)

        // Dismiss loading toast
        toast.dismiss(loadingId) // Now loadingId is in scope
        setLoadingToastId(null)

        if (result.success) {
          toast(result.message, {
            icon: <Success className='w-6 h-6 ml-3' />,
            position: 'bottom-center',
            duration: DEFAULT_DURATION
          })
        } else {
          toast(result.message, {
            icon: <Error className='w-6 h-6 ml-3' />,
            position: 'bottom-center'
          })
        }
      })
    } catch (error) {
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
        setLoadingToastId(null)
      }

      toast('حدث خطأ أثناء عملية الإيداع', {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center'
      })
    }
  }

  return (
    <Table className='min-w-full text-center divide-y divide-gray-200'>
      <TableHeader>
        <TableRow>
          <TableHead className='font-bold text-center select-none'>اسم المشروع</TableHead>
          <TableHead className='font-bold text-center select-none'>
            منطقة المشروع
          </TableHead>
          <TableHead className='font-bold text-center select-none'>تاريخ البدء</TableHead>
          <TableHead className='font-bold text-center select-none'>
            تاريخ الانتهاء
          </TableHead>
          <TableHead className='font-bold text-center select-none'>
            اخر موعد للمساهمة
          </TableHead>
          <TableHead className='font-bold text-center select-none'>عدد الأسهم</TableHead>
          <TableHead className='font-bold text-center select-none'>
            سعر السهم الواحد
          </TableHead>
          <TableHead className='font-bold text-center select-none'>أرباح السهم</TableHead>
          <TableHead className='font-bold text-center select-none'>
            دراسة الجدوى
          </TableHead>
          <TableHead className='font-bold text-center select-none'>
            حالة المشروع
          </TableHead>
          <TableHead className='font-bold text-center select-none'>العمليات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!projects || projects.length === 0 ? (
          <TableRow>
            <TableCell colSpan={15} className='space-y-6'>
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
            </TableCell>
          </TableRow>
        ) : projects[0] === null ? (
          <TableRow>
            <TableCell colSpan={15} className='space-y-6'>
              <NoRecords
                className='cols-span-5'
                button={
                  <Button variant={'pressable'} onClick={() => scrollToView(900)}>
                    إضافة مشروع جديد
                  </Button>
                }
              />
            </TableCell>
          </TableRow>
        ) : (
          projects.map(project => {
            return (
              <TableRow key={project.id}>
                <TableCell className='min-w-40'>{project.shms_project_name}</TableCell>
                <TableCell className='min-w-40'>
                  {project.shms_project_location}
                </TableCell>
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
                  {project.shms_project_total_stocks}
                </TableCell>
                <TableCell className='min-w-40' data-price>
                  {project.shms_project_stock_price}
                </TableCell>
                <TableCell className='min-w-40' data-price>
                  {project.shms_project_stock_profits}
                </TableCell>
                <TableCell className='min-w-40'>
                  {!project.shms_project_study_case ? (
                    <span className='text-red-500'>لا يوجد</span>
                  ) : (
                    <Modal
                      title={`دراسة الجدوى ${project.shms_project_name}`}
                      document={
                        (
                          project
                            .shms_project_study_case[0] as Projects['shms_project_study_case'][0]
                        ).imgDisplayPath
                      }
                      className='font-bold dark:text-white'
                    >
                      عرض دراسة الجدوى
                    </Modal>
                  )}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <span className='border py-1.5 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors'>
                        الاجراء
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='flex flex-col gap-y-1.5'>
                      <Confirm
                        variant={'destructive'}
                        onClick={async () => {
                          await deleteProject(project.id)
                        }}
                      >
                        حذف
                      </Confirm>
                      <Confirm
                        message='هل أنت متأكد من إيداع رأس المال؟'
                        onClick={() => handleDeposit('capital', project.id)}
                        isLoading={isPending}
                      >
                        إيداع رأس المال
                      </Confirm>
                      <Confirm
                        message='هل أنت متأكد من إيداع الأرباح؟'
                        onClick={() => handleDeposit('profits', project.id)}
                        isLoading={isPending}
                      >
                        إيداع الأرباح
                      </Confirm>
                      <Confirm
                        message='هل أنت متأكد من تصفير الأرباح ورأس المال؟'
                        onClick={() => handleResetCredit(project.id)}
                        isLoading={isPending}
                      >
                        إعادة تعيين الرصيد
                      </Confirm>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link href={'/dashboard/project/' + project.id}>
                    <Button variant={'outline'}>تعديل المشروع</Button>
                  </Link>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
