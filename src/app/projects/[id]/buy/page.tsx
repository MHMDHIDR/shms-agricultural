'use client'

import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import type {
  ProjectProps,
  UserLoggedInProps,
  UserProps,
  stocksPurchesedProps
} from '@/types'
import { Suspense, useEffect, useState } from 'react'
import axios from 'axios'
import { CardWrapper } from '@/components/auth/card-wrapper'
import Layout from '@/components/custom/Layout'
import { Skeleton } from '@/components/ui/skeleton'
import Divider from '@/components/custom/Divider'
import { Button } from '@/components/ui/button'
import UserStockSelect from './UserStockSelect'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Success, Error } from '@/components/icons/Status'
import { ReloadIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import Modal from '@/components/custom/Modal'

export default function BuyStocks({
  params: { id: projectId }
}: {
  params: { id: string }
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [project, setProject] = useState<ProjectProps>()
  // const [userStocks, setUserStocks] = useState<UserProps['shms_user_stocks']>()
  const [userStockLimit, setUserStockLimit] = useState(0)
  const [selectedStocks, setSelectedStocks] = useState(
    JSON.parse(
      typeof window !== 'undefined' ? localStorage.getItem('shms_project')! : '{}'
    )?.stocks ?? 0
  )
  const [percentageCode, setPercentageCode] = useState<string>(
    JSON.parse(
      typeof window !== 'undefined' ? localStorage.getItem('shms_project')! : '{}'
    )?.percentageCode ?? ''
  )
  const [newPercentage, setNewPercentage] = useState<number>(
    JSON.parse(
      typeof window !== 'undefined' ? localStorage.getItem('shms_project')! : '{}'
    )?.newPercentage ?? 0
  )
  const [acceptedTerm, setAcceptedTerm] = useState(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  const { data: session }: { data: UserLoggedInProps } = useSession()

  useEffect(() => {
    if (session?.token?.user?.shms_id) {
      const getUser = async () => {
        const { data: shms_user_stocks }: { data: UserProps } = await axios.get(
          `${API_URL}/users/getUserStocks/${session?.token?.user?.shms_id}`
        )
        const userStocks: stocksPurchesedProps[] = JSON.parse(
          String(shms_user_stocks.shms_user_stocks)
        )

        setUserStockLimit(
          calculateStockLimit(session?.token!?.user!, userStocks, projectId)
        )
      }

      getUser()
    }
  }, [session?.token, projectId])

  useEffect(() => {
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
    getProject()
  }, [projectId])

  const checkPercentageCode = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // check if the user entered a percentage code
    if (!percentageCode || percentageCode === '') {
      // if the user didn't enter a percentage code then we will just submit the form
      toast('الرجاء إدخال رمز زيادة النسبة', {
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

      return
    }

    // update shms_project with the percentageCode
    localStorage.setItem(
      'shms_project',
      JSON.stringify({
        shms_project: project?.shms_project_id,
        stocks: selectedStocks,
        newPercentage,
        percentageCode
      })
    )

    try {
      setIsSubmittingForm(true)

      const {
        data: { newPercentage, isValid }
      } = await axios.get(`${API_URL}/projects/checkPercentageCode/${percentageCode}`)

      // make sure to view the response from the data
      if (isValid) {
        setIsDoneSubmitting(true)
        setNewPercentage(newPercentage)

        toast('تم تحديث نسبة الربح بنجاح', {
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
    } catch (error: any) {
      toast(
        error.response.data.message?.length < 50
          ? error.response.data.message
          : 'حدث خطأ ما',
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
      )
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const handleNextClick = () => {
    // Save form data to localStorage
    localStorage.setItem(
      'shms_project',
      JSON.stringify({
        shms_project: project?.shms_project_id,
        stocks: selectedStocks,
        newPercentage,
        percentageCode
      })
    )
  }

  return (
    <Layout>
      <section className='container min-h-screen pt-20 rtl'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}
        >
          <CardWrapper heading={'صفحة شراء الاسهم'}>
            {isLoading ? (
              <div className='space-y-2'>
                <Skeleton className='w-full h-12' />
                <Skeleton className='w-full h-12' />
                <Skeleton className='w-full h-12' />
                <Skeleton className='w-full h-12' />
              </div>
            ) : (
              <form
                className='container w-full min-w-max'
                dir='rtl'
                onSubmit={checkPercentageCode}
              >
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      اسم المشروع
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                      {project?.shms_project_name}
                    </span>
                  </div>
                </div>
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      قيمة السهم الواحد
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <span
                      className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                      data-price
                    >
                      {project?.shms_project_stock_price ?? 0}
                    </span>
                  </div>
                </div>
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      اختيار عدد الأسهم
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <UserStockSelect
                      userStockLimit={!session ? 100 : userStockLimit ?? 100}
                      setSelectedStocks={setSelectedStocks}
                      selectedStocks={selectedStocks}
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
                    <span
                      className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                      data-price
                    >
                      {selectedStocks * (project ? project.shms_project_stock_price : 0)}
                    </span>
                  </div>
                </div>

                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      الربح المتوقع
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <span
                      className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                      data-price
                    >
                      {/* for each shms_project_stock_price the profit is === shms_project_stock_profits
                        example: if the stock price is 2500 and the profit per stock is 1000
                        then the total profit is 1000  * selectedStocks*/}
                      {newPercentage > 0
                        ? selectedStocks *
                            (project ? project.shms_project_stock_profits : 0) +
                          (selectedStocks *
                            (project ? project.shms_project_stock_profits : 0) *
                            newPercentage) /
                            100
                        : selectedStocks *
                          (project ? project.shms_project_stock_profits : 0)}
                    </span>
                  </div>
                </div>

                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      العائد الإجمالي مع راس المال
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <span
                      className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                      data-price
                    >
                      {/* for each shms_project_stock_price the profit is === shms_project_stock_profits
                        example: if the stock price is 2500 and the profit per stock is 1000
                        then the total profit is 1000  * selectedStocks*/}
                      {newPercentage > 0
                        ? selectedStocks *
                            (project ? project.shms_project_stock_profits : 0) +
                          (selectedStocks *
                            (project ? project.shms_project_stock_profits : 0) *
                            newPercentage) /
                            100 +
                          selectedStocks *
                            (project ? project.shms_project_stock_price : 0)
                        : selectedStocks *
                            (project ? project.shms_project_stock_profits : 0) +
                          selectedStocks *
                            (project ? project.shms_project_stock_price : 0)}
                    </span>
                  </div>
                </div>

                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      رمز خاص لزيادة النسبة <small>(اختياري)</small>
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <input
                      className='px-4 py-2 leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                      type='text'
                      placeholder='رمز خاص'
                      onChange={e => setPercentageCode(e.target.value)}
                      defaultValue={percentageCode}
                    />
                    <Button
                      className={`mr-2 text-center dark:text-white dark:font-bold${
                        isSubmittingForm
                          ? ' pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed'
                          : ''
                      }`}
                      disabled={isSubmittingForm || isDoneSubmitting}
                      type='submit'
                    >
                      {isSubmittingForm ? (
                        <>
                          <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                          تأكيد الرمز ...
                        </>
                      ) : isDoneSubmitting ? (
                        <>
                          <Success className='ml-2' />
                          تم إضافة النسبة بنجاح
                        </>
                      ) : (
                        'تأكيد الرمز'
                      )}
                    </Button>
                  </div>
                </div>

                <div className='flex-col items-start w-full mb-6 md:flex'>
                  <label
                    htmlFor='accept_termsAndPrivacy'
                    className='block mb-1 font-bold text-gray-500 cursor-pointer md:text-right md:mb-0'
                  >
                    <Checkbox
                      id='accept_termsAndPrivacy'
                      className='ml-2'
                      onCheckedChange={(isChecked: boolean) => setAcceptedTerm(isChecked)}
                      required
                    />
                    بالضغط هنا فأنك توافق على
                    <Modal
                      title={`شروط  ${project?.shms_project_name}`}
                      document={
                        project?.shms_project_terms ??
                        (project?.shms_project_description as string)
                      }
                      className='font-bold dark:text-white mr-2'
                      contentClassName='min-w-[90svw]'
                      asText
                    >
                      شروط المشــــروع
                    </Modal>
                    <span className='text-red-500'>*</span>
                  </label>
                  <div className='md:w-1/3'></div>
                </div>
              </form>
            )}
          </CardWrapper>
        </div>

        <div className='flex items-center justify-center w-full m-5 space-x-4'>
          <Suspense fallback={<Skeleton className='w-5 h-1' />}>
            <Link
              href={
                !session
                  ? `/auth/signin?callbackUrl=/projects/${projectId}/buy`
                  : `/projects/${projectId}/personalData`
              }
              aria-disabled={selectedStocks === 0 || !acceptedTerm}
              className={`pressable ${
                selectedStocks === 0 || !acceptedTerm
                  ? 'pointer-events-none opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={handleNextClick}
            >
              التالي
            </Link>
          </Suspense>
        </div>
      </section>
    </Layout>
  )
}

function calculateStockLimit(
  user: UserProps,
  userStocks: stocksPurchesedProps[],
  projectId: string
) {
  if (!user || !user?.shms_user_stock_limit) return 100

  // check if the stock in the shms_user_stocks is equal to the projectId
  const userStocksForProject = userStocks?.reduce(
    (acc, stock) => (stock.shms_project_id === projectId ? acc + stock.stocks : acc + 0),
    0
  )

  return user.shms_user_stock_limit! - (userStocksForProject ?? 0)
}
