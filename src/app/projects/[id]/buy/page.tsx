'use client'

import { API_URL } from '@/data/constants'
import { ProjectProps } from '@/types'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { CardWrapper } from '@/components/auth/card-wrapper'
import Layout from '@/components/custom/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import Divider from '@/components/custom/Divider'

export default function BuyStocks({
  params: { id: projectId }
}: {
  params: { id: string }
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [project, setProject] = useState<ProjectProps>()
  const [amountOfStocks, setAmountOfStocks] = useState(0)

  const getProject = async () => {
    try {
      setIsLoading(true)
      const {
        data: { project }
      }: { data: { project: ProjectProps } } = await axios.get(
        `${API_URL}/projects/get/${projectId}`
      )
      setProject(project)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getProject()
  }, [])

  return (
    <Layout>
      <section className='pt-20 container rtl min-h-screen'>
        {/* كل شخص يستطيع شراء عدد من الأسهم على حسب الحد المسموح به في user.shms_user_stock_limit */}

        <CardWrapper className='md:w-[50rem] mx-auto' heading={'صفحة شراء أسهم'}>
          {isLoading ? (
            <div className='space-y-2'>
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
              <Skeleton className='w-full h-12' />
            </div>
          ) : (
            <form className='container w-full min-w-max' dir='rtl'>
              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    قيمة السهم الواحد
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <input
                    className='w-full font-bold px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    type='text'
                    value={project ? project.shms_project_stock_price : 0}
                    disabled
                  />
                </div>
              </div>
              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    شراء عدد الأسهم
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <input
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    type='number'
                    placeholder='عدد الأسهم'
                    onChange={e => setAmountOfStocks(Number(e.target.value))}
                  />
                </div>
              </div>
              <Divider className='my-10' />
              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    إجمالي الدفع
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <input
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    type='text'
                    placeholder={String(
                      project ? project.shms_project_stock_price : 0 * amountOfStocks
                    )}
                    disabled
                  />
                </div>
              </div>
              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    الربح الإجمالي المتوقع
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <input
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    type='text'
                    placeholder='عدد الأسهم'
                  />
                </div>
              </div>
            </form>
          )}
        </CardWrapper>
      </section>
    </Layout>
  )
}
