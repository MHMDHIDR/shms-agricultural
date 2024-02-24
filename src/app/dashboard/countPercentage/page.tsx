'use client'

import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { TabsContent } from '@/components/ui/tabs'
import type { ProjectProps } from '@/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Confirm from '@/components/custom/Confirm'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Success, Error } from '@/components/icons/Status'
import { ReloadIcon } from '@radix-ui/react-icons'
import { redirect, scrollToView } from '@/lib/utils'
import Divider from '@/components/custom/Divider'
import Copy from '@/components/custom/Copy'

export default function CountPercentage() {
  const [projects, setProjects] = useState<ProjectProps[]>([])
  const [selectedProject, setSelectedProject] = useState<
    ProjectProps['shms_project_id'] | null
  >(null)
  const [percentage, setPercentage] = useState<number>(0)
  const [percentageCode, setPercentageCode] = useState<string>('الرجاء اختيار المشروع')
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })
  const [percentageCodesRefresh, setPercentageCodesRefresh] = useState<number>(0)

  const getProjects = async () => {
    const { data: projects }: { data: ProjectProps[] } = await axios.get(
      `${API_URL}/projects/get`
    )
    setProjects(projects)
  }

  useEffect(() => {
    getProjects()
  }, [percentageCodesRefresh])

  const handleSubmitPercentage = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })

      const { data } = await axios.patch(`${API_URL}/projects/edit/${selectedProject}`, {
        shms_project_special_percentage: percentage,
        shms_project_special_percentage_code: percentageCode,
        updatePercentage: true
      })

      // make sure to view the response from the data
      if (data.projectUpdated === 1) {
        setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })

        toast(data.message, {
          icon: <Success />,
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
      }

      setPercentageCodesRefresh(data.projectUpdated ?? 0)
      setTimeout(() => redirect('/dashboard'), DEFAULT_DURATION / 2)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ?? error
      toast(errorMessage.length < 50 ? errorMessage : 'حدث خطأ ما'),
        {
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
        }
      console.error('Error: ', errorMessage)
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
    }
  }

  const deletePercentageCode = async (projectId: string) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })

      const { data }: { data: ProjectProps } = await axios.patch(
        `${API_URL}/projects/edit/${projectId}`,
        {
          shms_project_special_percentage: null,
          shms_project_special_percentage_code: null,
          updatePercentage: true
        }
      )

      // make sure to view the response from the data
      if (data.projectUpdated === 1) {
        toast(data.message ?? 'تم حذف الرمز بنجاح 👍🏼', {
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
        toast('حدث خطأ ما أثناء حذف الرمز', {
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

      setPercentageCodesRefresh(data.projectUpdated ?? 0)
      setTimeout(() => redirect('/dashboard'), DEFAULT_DURATION / 2)
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
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
    }
  }

  return (
    <TabsContent value='profits_percentage'>
      <div className='flex flex-wrap justify-center gap-2.5 my-4'>
        <CardWrapper
          heading='اضافة رمز زيادة ربح جديد '
          backButtonHref='/auth/signup'
          className='md:w-full max-w-full'
        >
          <form dir='rtl' onSubmit={handleSubmitPercentage}>
            <div className='flex items-center justify-center'>
              <div className='md:w-2/3'>
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      اختار المشروع
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <Select
                      dir='rtl'
                      onValueChange={(projectId: string) => {
                        setSelectedProject(projectId)
                        // special code for the percentage code contains 7 random characters
                        const PercentageCode = Math.random()
                          .toString(36)
                          .substring(2, 9)
                          .toUpperCase()
                        setPercentageCode(PercentageCode)
                      }}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='اختيار المشروع' />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(({ shms_project_id, shms_project_name }) => (
                          <SelectItem key={shms_project_id} value={shms_project_id}>
                            {shms_project_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      رمز زيادة النسبة
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                      {percentageCode}
                    </span>
                    <small className='block select-none'>
                      رمز زيادة النسبة الذي سيتم استخدامه من قبل العميل للحصول على النسبة
                    </small>
                  </div>
                </div>

                {/* ادخل النسبة المئوية */}
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label
                      htmlFor='newPercentage'
                      className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                    >
                      ادخل النسبة المئوية
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <input
                      className='w-full px-4 py-2 text-lg leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                      type='number'
                      placeholder='15'
                      id='newPercentage'
                      min='0'
                      max='100'
                      onChange={e => setPercentage(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                {/* الربح الحالي */}
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label
                      htmlFor='password'
                      className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                    >
                      الربح الحالي
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                      {projects.find(
                        ({ shms_project_id }) => shms_project_id === selectedProject
                      )?.shms_project_stock_profits ?? 0}
                    </span>
                  </div>
                </div>

                {/* الربح الجديد */}
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label
                      htmlFor='password'
                      className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                    >
                      الربح الجديد
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    {(() => {
                      const currProfits = Number(
                        projects.find(
                          ({ shms_project_id }) => shms_project_id === selectedProject
                        )?.shms_project_stock_profits
                      )
                      const newProfits = currProfits
                        ? currProfits + (currProfits * percentage) / 100
                        : 0

                      return (
                        <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                          {newProfits}
                        </span>
                      )
                    })()}
                  </div>
                </div>

                <div className='mb-6 md:flex md:items-center'>
                  <Button
                    className={
                      formStatus.isSubmittingDone
                        ? 'pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed'
                        : formStatus.isSubmitting ||
                          selectedProject === null ||
                          !percentage
                        ? 'pointer-events-none cursor-progress'
                        : ''
                    }
                    disabled={
                      formStatus.isSubmitting || selectedProject === null || !percentage
                    }
                  >
                    {formStatus.isSubmitting ? (
                      <>
                        <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                        جاري الحفظ ...
                      </>
                    ) : formStatus.isSubmitting ? (
                      <>
                        <Success className='ml-2' />
                        تم إضافة النسبة بنجاح
                      </>
                    ) : (
                      'حفظ'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
          {/* Table showing the added pecentages codes and the project that belongs to it with the ability to delete each code invidually */}
          <Divider className='my-10' />
          <Table className='table min-w-full min-h-full mt-0 text-center divide-y divide-gray-200 rtl'>
            <TableHeader>
              <TableRow>
                <TableHead className='font-bold text-center select-none min-w-72'>
                  اسم المشروع
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  رمز زيادة نسبة الربح
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  النسبة المئوية
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  الربح الحالي
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  الربح الجديد
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  الاجراء
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.filter(project => project.shms_project_special_percentage_code)
                .length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className='space-y-6'>
                    <span className='text-center text-gray-500'>
                      لا يوجد اي رموز زيادة نسبة الربح
                    </span>
                    <br />
                    <Button onClick={() => scrollToView(100)}>
                      إضافة رمز زيادة نسبة الربح
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                projects
                  .filter(project => project.shms_project_special_percentage_code)
                  .map(project => (
                    <TableRow key={project.shms_project_id}>
                      <TableCell className='min-w-72'>
                        {project.shms_project_name}
                      </TableCell>
                      <TableCell className='min-w-40'>
                        <Copy
                          text={project.shms_project_special_percentage_code}
                          className='inline ml-2'
                        />
                        <span>{project.shms_project_special_percentage_code}</span>
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {project.shms_project_special_percentage}%
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {project.shms_project_stock_profits}
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {project.shms_project_stock_profits +
                          (project.shms_project_stock_profits *
                            project.shms_project_special_percentage) /
                            100}
                      </TableCell>
                      <TableCell className='flex min-w-56 gap-x-2'>
                        <Confirm
                          variant={'destructive'}
                          onClick={async () => {
                            await deletePercentageCode(project.shms_project_id)
                          }}
                        >
                          {formStatus.isSubmitting ? (
                            <>
                              <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                              جاري الحذف ...
                            </>
                          ) : formStatus.isSubmitting ? (
                            <>
                              <Success className='ml-2' />
                              تم الحذف
                            </>
                          ) : (
                            'حذف'
                          )}
                        </Confirm>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardWrapper>
      </div>
    </TabsContent>
  )
}
