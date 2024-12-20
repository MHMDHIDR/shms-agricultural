'use client'

import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { Suspense, useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '@/components/custom/layout'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import UserStockSelect from './UserStockSelect'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Success, Error } from '@/components/icons/status'
import { ReloadIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import Modal from '@/components/custom/modal'
import { LoadingCard } from '@/components/custom/loading'
import { formattedPrice } from '@/libs/utils'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import type { UserLoggedInProps, getAuthType } from '@/types'
import type { Projects, Users } from '@prisma/client'

export default function BuyStocks({
  params: { id: projectId }
}: {
  params: { id: string }
}) {
  useDocumentTitle('شراء الأسهم')

  const { data: session }: { data: UserLoggedInProps } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [project, setProject] = useState<Projects>()
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

  useEffect(() => {
    const getProject = async () => {
      try {
        setIsLoading(true)
        const {
          data: { project }
        }: { data: { project: Projects } } = await axios.get(
          `${API_URL}/projects/get/${projectId}`
        )
        setProject(project)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getProject()
  }, [projectId])

  useEffect(() => {
    //if the user is signed in then we will check getUserwithdrawableAmount and update the localStorage
    if (localStorage.getItem('shms_user_data')) {
      const userId = JSON.parse(localStorage.getItem('shms_user_data') as string)?.userId

      const getUserWithdrawableAmount = async () => {
        try {
          const {
            data: { shms_user_stocks }
          }: {
            data: { shms_user_stocks: Users['shms_user_stock_limit'] }
          } = await axios.get(`${API_URL}/users/getUserStocks/${userId}`)

          // set one single property in the localStorage shms_user_data withdrawableAmount to the withdrawableAmount
          localStorage.setItem(
            'shms_user_data',
            JSON.stringify({
              ...JSON.parse(localStorage.getItem('shms_user_data') as string),
              userStockLimit: shms_user_stocks
            })
          )
        } catch (error) {
          console.error(error)
        }
      }
      getUserWithdrawableAmount()
    }
  }, [])

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
        shms_project: project?.id,
        stocks: selectedStocks,
        newPercentage,
        percentageCode
      })
    )

    try {
      setIsSubmittingForm(true)

      const {
        data: { newPercentage, isValid }
      } = await axios.post(`${API_URL}/projects/checkPercentageCode/${percentageCode}`, {
        projectId
      })

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
        shms_project: project?.id,
        stocks: selectedStocks,
        newPercentage,
        percentageCode,
        totalPaymentAmount:
          selectedStocks * (project ? project.shms_project_stock_price : 0)
      })
    )
  }

  const userStockLimit: getAuthType['userStockLimit'] =
    typeof window !== 'undefined' &&
    JSON.parse(String(localStorage.getItem('shms_user_data')))?.userStockLimit

  return (
    <Layout>
      <section className='flex flex-col mx-auto mt-20 mb-auto'>
        {isLoading ? (
          <>
            <LoadingCard className='w-5/6 mx-auto bg-white border border-gray-400' />
            <br />
            <LoadingCard className='w-5/6 mx-auto bg-white border border-gray-400' />
            <br />
          </>
        ) : (
          <form
            className='w-full px-8 pt-10 mx-auto mb-10 bg-white border shadow-md md:px-20 dark:bg-gray-700 rtl'
            onSubmit={checkPercentageCode}
            noValidate
          >
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  اسم المشروع
                </label>
              </div>
              <div className='md:w-2/3'>
                <span className='block p-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none'>
                  {project?.shms_project_name}
                </span>
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  قيمة السهم الواحد
                </label>
              </div>
              <div className='md:w-2/3'>
                <span className='block p-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none'>
                  {formattedPrice(project?.shms_project_stock_price ?? 0, 0)}
                </span>
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  اختيار عدد الأسهم
                </label>
              </div>
              <div className='md:w-2/3'>
                <UserStockSelect
                  userStockLimit={
                    project?.shms_project_available_stocks && userStockLimit
                      ? Math.min(userStockLimit, project.shms_project_available_stocks)
                      : userStockLimit || 100
                  }
                  setSelectedStocks={setSelectedStocks}
                  selectedStocks={selectedStocks}
                />
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  إجمالي الدفع
                </label>
              </div>
              <div className='md:w-2/3'>
                <span className='block p-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none'>
                  {formattedPrice(
                    selectedStocks * (project ? project.shms_project_stock_price : 0),
                    0
                  )}
                </span>
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  الربح المتوقع
                </label>
              </div>
              <div className='md:w-2/3'>
                <div style={{ position: 'relative', width: '100%' }}>
                  <span className='block p-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none'>
                    {formattedPrice(
                      newPercentage > 0
                        ? selectedStocks *
                            (project ? project.shms_project_stock_profits : 0) +
                            (selectedStocks *
                              (project ? project.shms_project_stock_profits : 0) *
                              newPercentage) /
                              100
                        : selectedStocks *
                            (project ? project.shms_project_stock_profits : 0),
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  العائد الإجمالي مع راس المال
                </label>
              </div>
              <div className='md:w-2/3'>
                <span className='block p-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none'>
                  {formattedPrice(
                    newPercentage > 0
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
                            (project ? project.shms_project_stock_price : 0),
                    0
                  )}
                </span>
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  رمز خاص لزيادة النسبة <small>(اختياري)</small>
                </label>
              </div>
              <div className='md:w-2/3 space-y-2'>
                <input
                  className='w-64 px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none md:w-96 dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
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
            <div className='mb-6 md:flex md:items-center'>
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
                <span className='text-red-500'>*</span> بالضغط هنا فأنك توافق على
                <Modal
                  title={`شروط  ${project?.shms_project_name}`}
                  document={
                    project?.shms_project_terms ??
                    (project?.shms_project_description as string)
                  }
                  className='mr-2 font-bold dark:text-white'
                  contentClassName='w-[90vw] max-h-[85vh] overflow-y-auto dark:text-white'
                  asText
                >
                  شروط المشــــروع
                </Modal>
              </label>
            </div>
          </form>
        )}
        <Suspense fallback={<Skeleton className='w-5 h-1' />}>
          <Link
            href={
              !session
                ? `/auth/signin?callbackUrl=/projects/${projectId}/buy`
                : `/projects/${projectId}/personalData`
            }
            aria-disabled={selectedStocks === 0 || !acceptedTerm}
            className={`pressable w-fit mx-auto ${
              selectedStocks === 0 || !acceptedTerm
                ? 'pointer-events-none opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={handleNextClick}
          >
            التالي
          </Link>
        </Suspense>
      </section>
    </Layout>
  )
}
