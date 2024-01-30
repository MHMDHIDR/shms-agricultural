'use client'

import FileUpload from '@/components/custom/FileUpload'
import FormMessage from '@/components/custom/FormMessage'
import Layout from '@/components/custom/Layout'
import { Error, Success } from '@/components/icons/Status'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { FileUploadContext } from '@/providers/FileUpload'
import type { ProjectProps } from '@/types'
import { ReloadIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function EditProjectPage({
  params: { id: projectId }
}: {
  params: { id: string }
}) {
  const [projectImages, setProjectImages] = useState<ProjectProps['shms_project_images']>(
    []
  )
  const [projectName, setProjectName] = useState('')
  const [projectLocation, setProjectLocation] = useState('')
  const [projectStartDate, setProjectStartDate] = useState<Date>()
  const [projectEndDate, setProjectEndDate] = useState<Date>()
  const [projectInvestEndDate, setProjectInvestEndDate] = useState<Date>()
  const [stockPrice, setStockPrice] = useState<number>()
  const [stockProfits, setStockProfits] = useState<number>()
  const [projectDescription, setProjectDescription] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  // Form Errors
  const [projectImagesError, setImagesNameError] = useState('')
  const [projectNameError, setProjectNameError] = useState('')
  const [projectLocationError, setProjectLocationError] = useState('')
  const [projectStartDateError, setProjectStartDateError] = useState('')
  const [projectEndDateError, setProjectEndDateError] = useState('')
  const [projectInvestEndDateError, setProjectInvestEndDateError] = useState('')
  const [stockPriceError, setStockPriceError] = useState('')
  const [stockProfitsError, setStockProfitsError] = useState('')
  const [projectDescriptionError, setProjectDescriptionError] = useState('')

  const { file, setFileURLs, setFile } = useContext(FileUploadContext)

  const { push } = useRouter()

  // Get Project details and set the state
  useEffect(() => {
    const getProjectDetails = async () => {
      const {
        data: { project }
      }: { data: { project: ProjectProps } } = await axios.get(
        `${API_URL}/projects/get/${projectId}`
      )
      setProjectImages(JSON.parse(String(project.shms_project_images)))
      setProjectName(project.shms_project_name)
      setProjectLocation(project.shms_project_location)
      setProjectStartDate(new Date(project.shms_project_start_date))
      setProjectEndDate(new Date(project.shms_project_end_date))
      setProjectInvestEndDate(new Date(project.shms_project_invest_date))
      setStockPrice(project.shms_project_stock_price)
      setStockProfits(project.shms_project_stock_profits)
      setProjectDescription(project.shms_project_description)
    }

    getProjectDetails()
  }, [projectId])

  const handelEditProject = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    // check if the form is valid
    if (file.length === 0) {
      resetFormErrors()
      setImagesNameError('الرجاء التأكد من رفع صور المشروع')
    } else if (projectName === '') {
      resetFormErrors()
      setProjectNameError('الرجاء التأكد من كتابة اسم المشروع')
    } else if (projectLocation === '') {
      resetFormErrors()
      setProjectLocationError('الرجاء التأكد من كتابة موقع المشروع')
    } else if (!projectStartDate) {
      resetFormErrors()
      setProjectStartDateError('الرجاء التأكد من تحديد تاريخ بداية المشروع')
    } else if (!projectEndDate) {
      resetFormErrors()
      setProjectEndDateError('الرجاء التأكد من تحديد تاريخ نهاية المشروع')
    } else if (!projectInvestEndDate) {
      resetFormErrors()
      setProjectInvestEndDateError('الرجاء التأكد من تحديد تاريخ اخر موعد للمساهمة')
    } else if (!stockPrice || stockPrice === 0) {
      resetFormErrors()
      setStockPriceError('الرجاء التأكد من كتابة سعر السهم')
    } else if (!stockProfits || stockProfits === 0) {
      resetFormErrors()
      setStockProfitsError('الرجاء التأكد من كتابة ارباح السهم')
    } else if (projectDescription === '') {
      resetFormErrors()
      setProjectDescriptionError('الرجاء التأكد من كتابة وصف المشروع')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        // create a new form data with files data
        const formData = new FormData()
        formData.append('multiple', 'true')

        file.forEach((singleFile, index) => formData.append(`file[${index}]`, singleFile))
        // upload the project images to s3
        const {
          data: { shms_project_id, shms_project_images }
        }: {
          data: ProjectProps
        } = await axios.post(`${API_URL}/uploadToS3`, formData)

        // upload the project data to the database
        const addProject: { data: ProjectProps } = await axios.post(
          `${API_URL}/projects/edit/${projectId}`,
          {
            shms_project_id,
            shms_project_name: projectName,
            shms_project_location: projectLocation,
            shms_project_start_date: projectStartDate,
            shms_project_end_date: projectEndDate,
            shms_project_invest_date: projectInvestEndDate,
            shms_project_stock_price: stockPrice,
            shms_project_stock_profits: stockProfits,
            shms_project_description: projectDescription,
            shms_project_images
          }
        )
        //getting response from backend
        const { data } = addProject

        // make sure to view the response from the data
        data.projectAdded === 1 &&
          toast(data.message, {
            icon: <Info className='text-blue-300' />,
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

        data.projectAdded === 1 ? setIsDoneSubmitting(true) : setIsDoneSubmitting(false)
        resetFormFields()
        setTimeout(() => push(`/dashboard`), DEFAULT_DURATION)
      } catch (error: any) {
        toast(error.length < 30 ? JSON.stringify(error) : 'حدث خطأ ما'),
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
        console.error('Error', error)
      } finally {
        setIsSubmittingForm(false)
      }
    }
  }

  /**
   * Reset all form errors
   */
  function resetFormErrors() {
    setProjectNameError('')
    setProjectLocationError('')
    setProjectStartDateError('')
    setProjectEndDateError('')
    setProjectInvestEndDateError('')
    setStockPriceError('')
    setStockProfitsError('')
    setProjectDescriptionError('')
  }

  /**
   * Reset all form fields
   */
  function resetFormFields() {
    setProjectName('')
    setProjectLocation('')
    setProjectStartDate(undefined)
    setProjectEndDate(undefined)
    setProjectInvestEndDate(undefined)
    setStockPrice(undefined)
    setStockProfits(undefined)
    setProjectDescription('')
    setFile!([])
    setFileURLs([])
  }

  return (
    <Layout>
      <Card className='mt-56 rtl'>
        <form onSubmit={e => handelEditProject(e)}>
          <CardHeader>
            <CardTitle className='select-none text-center'>
              تعديل مشروع{' '}
              <strong>
                {projectName && projectName.length > 0 ? (
                  projectName
                ) : (
                  <Skeleton className='w-32 h-4 inline-block bg-gray-400' />
                )}
              </strong>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='grid grid-cols-2 grid-rows-3 gap-y-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              <FileUpload
                data={{ projectId, defaultImg: projectImages, imgName: projectName }}
                ignoreRequired
              />
            </div>
            {projectImagesError && <FormMessage error>{projectImagesError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='projectName'>اسم المشروع</Label>
              <Input
                id='projectName'
                type='text'
                onChange={e => setProjectName(e.target.value)}
                defaultValue={projectName}
              />
            </div>
            {projectNameError && <FormMessage error>{projectNameError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='projectLocation'>منطقة المشروع</Label>
              <Input
                id='projectLocation'
                type='text'
                onChange={e => setProjectLocation(e.target.value)}
                defaultValue={projectLocation}
              />
            </div>
            {projectLocationError && (
              <FormMessage error>{projectLocationError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectStartDate'>تاريخ بداية المشروع</Label>
              <div className='md:w-3/3'>
                <input
                  id='projectStartDate'
                  className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectStartDate(new Date(e.target.value))}
                  defaultValue={projectStartDate?.toISOString().split('T')[0]}
                />
              </div>
            </div>
            {projectStartDateError && (
              <FormMessage error>{projectStartDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectEndDate'>تاريخ نهاية المشروع</Label>
              <div className='md:w-3/3'>
                <input
                  id='projectEndDate'
                  className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectEndDate(new Date(e.target.value))}
                  defaultValue={projectEndDate?.toISOString().split('T')[0]}
                />
              </div>
            </div>
            {projectEndDateError && (
              <FormMessage error>{projectEndDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectInvestEndDate'>آخر موعد للمساهمة</Label>
              <div className='md:w-3/3'>
                <input
                  id='projectInvestEndDate'
                  className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectInvestEndDate(new Date(e.target.value))}
                  defaultValue={projectInvestEndDate?.toISOString().split('T')[0]}
                />
              </div>
            </div>
            {projectInvestEndDateError && (
              <FormMessage error>{projectInvestEndDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='stockPrice'>قيمة السهم الواحد</Label>
              <Input
                id='stockPrice'
                type='number'
                inputMode='numeric'
                min={0}
                onChange={e => setStockPrice(parseFloat(e.target.value))}
                defaultValue={stockPrice}
              />
            </div>
            {stockPriceError && <FormMessage error>{stockPriceError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='stockProfits'>أرباح السهم الواحد</Label>
              <Input
                id='stockProfits'
                type='number'
                inputMode='numeric'
                min={0}
                onChange={e => setStockProfits(parseFloat(e.target.value))}
                defaultValue={stockProfits}
              />
            </div>
            {stockProfitsError && <FormMessage error>{stockProfitsError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='projectDescription'>وصف المشروع</Label>
              <textarea
                id='projectDescription'
                className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                placeholder='أدخل وصف المشروع'
                rows={5}
                onChange={e => setProjectDescription(e.target.value)}
                defaultValue={projectDescription}
              />
            </div>
            {projectDescriptionError && (
              <FormMessage error>{projectDescriptionError}</FormMessage>
            )}
          </CardContent>
          <CardFooter>
            <Button
              disabled={isDoneSubmitting}
              type='submit'
              className={`shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold${
                isDoneSubmitting
                  ? ' pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed'
                  : ''
              }`}
            >
              {isSubmittingForm ? (
                <>
                  <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                  جاري تعديل المشروع ...
                </>
              ) : isDoneSubmitting ? (
                <>
                  <Success className='ml-2' />
                  تم تعديل المشروع بنجاح
                </>
              ) : (
                'حفظ التعديلات'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  )
}
