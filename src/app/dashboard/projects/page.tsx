'use client'

import Divider from '@/components/custom/Divider'
import FileUpload from '@/components/custom/FileUpload'
import FormMessage from '@/components/custom/FormMessage'
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
import { TabsContent } from '@/components/ui/tabs'
import { API_URL, APP_LOGO_sm, APP_TITLE, DEFAULT_DURATION } from '@/data/constants'
import { FileUploadContext } from '@/providers/FileUpload'
import type { ProjectProps } from '@/types'
import { ReloadIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { toast } from 'sonner'
import ProjectsTable from './projectsTabel/page'

export default function Projects() {
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

  const handelAddProject = async (e: {
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
          `${API_URL}/projects/add`,
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
        //handle error, show notification using Shadcn notifcation
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
    <TabsContent value='add_project'>
      <Card className='rtl'>
        <ProjectsTable />
        <Divider className='my-10' />
        <form onSubmit={e => handelAddProject(e)}>
          <CardHeader>
            <CardTitle>اضافة مشروع جديد</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='grid grid-cols-2 grid-rows-3 gap-y-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              <FileUpload
                data={{
                  defaultImg: [
                    { imgDisplayName: APP_TITLE, imgDisplayPath: APP_LOGO_sm }
                  ],
                  imgName: 'Agricultural Project View'
                }}
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
              />
            </div>
            {projectNameError && <FormMessage error>{projectNameError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='projectLocation'> منطقة المشروع </Label>
              <Input
                id='projectLocation'
                type='text'
                onChange={e => setProjectLocation(e.target.value)}
              />
            </div>
            {projectLocationError && (
              <FormMessage error>{projectLocationError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectStartDate'> تاريخ بداية المشروع </Label>
              <div className='md:w-3/3'>
                <input
                  id='projectStartDate'
                  className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectStartDate(new Date(e.target.value))}
                />
              </div>
            </div>
            {projectStartDateError && (
              <FormMessage error>{projectStartDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectEndDate'> تاريخ نهاية المشروع </Label>
              <div className='md:w-3/3'>
                <input
                  id='projectEndDate'
                  className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectEndDate(new Date(e.target.value))}
                />
              </div>
            </div>
            {projectEndDateError && (
              <FormMessage error>{projectEndDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectInvestEndDate'> اخر موعد للمساهمة </Label>
              <div className='md:w-3/3'>
                <input
                  id='projectInvestEndDate'
                  className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectInvestEndDate(new Date(e.target.value))}
                />
              </div>
            </div>
            {projectInvestEndDateError && (
              <FormMessage error>{projectInvestEndDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='stockPrice'> قيمة السهم الواحد </Label>
              <Input
                id='stockPrice'
                type='number'
                inputMode='numeric'
                min={0}
                onChange={e => setStockPrice(parseFloat(e.target.value))}
              />
            </div>
            {stockPriceError && <FormMessage error>{stockPriceError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='stockProfits'> ارباح السهم الواحد </Label>
              <Input
                id='stockProfits'
                type='number'
                inputMode='numeric'
                min={0}
                onChange={e => setStockProfits(parseFloat(e.target.value))}
              />
            </div>
            {stockProfitsError && <FormMessage error>{stockProfitsError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='projectDescription'> وصف المشروع </Label>
              <textarea
                id='projectDescription'
                onChange={e => setProjectDescription(e.target.value)}
                className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                placeholder='أدخل وصف المشروع'
                rows={5}
              />
            </div>
            {projectDescriptionError && (
              <FormMessage error>{projectDescriptionError}</FormMessage>
            )}
          </CardContent>
          <CardFooter>
            <Button
              disabled={isSubmittingForm}
              type='submit'
              className={`shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold${
                isDoneSubmitting ? ' disabled:opacity-50 disabled:cursor-not-allowed' : ''
              }`}
            >
              {isSubmittingForm ? (
                <>
                  <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                  جاري إضافة المشروع ...
                </>
              ) : isDoneSubmitting ? (
                <>
                  <Success className='ml-2' />
                  تم إضافة المشروع بنجاح
                </>
              ) : (
                'إضافة'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  )
}
