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
import {
  API_URL,
  APP_LOGO_sm,
  APP_TITLE,
  DEFAULT_DURATION,
  MAX_FILE_UPLOAD_SIZE
} from '@/data/constants'
import { validateFile } from '@/lib/utils'
import { FileUploadContext } from '@/providers/FileUpload'
import type { ProjectProps } from '@/types'
import { ReloadIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProjectsTable from './projectsTabel/page'

export default function Projects() {
  const [_projects, setProjects] = useState<ProjectProps[]>([])
  const [projectName, setProjectName] = useState('')
  const [projectLocation, setProjectLocation] = useState('')
  const [projectStartDate, setProjectStartDate] = useState<Date>()
  const [projectEndDate, setProjectEndDate] = useState<Date>()
  const [projectInvestEndDate, setProjectInvestEndDate] = useState<Date>()
  const [projectAvailableStocks, setProjectAvailableStocks] = useState<number>()
  const [stockPrice, setStockPrice] = useState<number>()
  const [stockProfits, setStockProfits] = useState<number>()
  const [projectDescription, setProjectDescription] = useState('')
  const [caseStudyfile, setCaseStudyFile] = useState<File[]>([])

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  const onCaseStudyFileAdd = (e: { target: { files: any } }) => {
    setCaseStudyFile(Array.from(e.target.files))
  }

  // Form Errors
  const [projectImagesError, setImagesNameError] = useState('')
  const [projectNameError, setProjectNameError] = useState('')
  const [projectLocationError, setProjectLocationError] = useState('')
  const [projectStartDateError, setProjectStartDateError] = useState('')
  const [projectEndDateError, setProjectEndDateError] = useState('')
  const [projectInvestEndDateError, setProjectInvestEndDateError] = useState('')
  const [projectAvailableStocksError, setProjectAvailableStocksError] = useState('')
  const [stockPriceError, setStockPriceError] = useState('')
  const [stockProfitsError, setStockProfitsError] = useState('')
  const [projectDescriptionError, setProjectDescriptionError] = useState('')
  const [caseStudyfileError, setCaseStudyFileError] = useState('')

  const { file } = useContext(FileUploadContext)

  const getProjects = async () => {
    const { data: projects }: { data: ProjectProps[] } = await axios.get(
      `${API_URL}/projects/get`
    )
    setProjects(projects)
  }

  useEffect(() => {
    getProjects()
  }, [isDoneSubmitting])

  /*
   * a function to set the grid rows and columns based on the number of files uploaded
   * @returns {string} the grid rows and columns
   */
  const fileUploadGrid = (): string => {
    // Calculate the number of rows based on the filesLength
    const numRows = Math.ceil(file.length / 3)
    // Return the dynamic grid rows string
    return `grid-rows-${numRows}`
  }

  const handleCaseStudyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the first file uploaded
    const file = e.target.files![0]
    const { isAllowedExtension, isAllowedSize } = validateFile(file as File, ['pdf'])

    if (!isAllowedExtension) {
      setCaseStudyFileError('فقط الملفات من النوع pdf مسموح بها')
    } else if (!isAllowedSize) {
      // MAX_FILE_UPLOAD_SIZE === 10MB
      setCaseStudyFileError(
        `الحد الأقصى لحجم الملف هو ${MAX_FILE_UPLOAD_SIZE * 2} ميغابايت`
      )
    } else {
      setCaseStudyFileError('')
      onCaseStudyFileAdd(e)
    }
  }

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
    } else if (!projectAvailableStocks || projectAvailableStocks === 0) {
      resetFormErrors()
      setProjectAvailableStocksError('الرجاء التأكد من كتابة عدد الأسهم المتاحة')
    } else if (!stockPrice || stockPrice === 0) {
      resetFormErrors()
      setStockPriceError('الرجاء التأكد من كتابة سعر السهم')
    } else if (!stockProfits || stockProfits === 0) {
      resetFormErrors()
      setStockProfitsError('الرجاء التأكد من كتابة ارباح السهم')
    } else if (projectDescription === '') {
      resetFormErrors()
      setProjectDescriptionError('الرجاء التأكد من كتابة وصف المشروع')
    } else if (caseStudyfile.length === 0) {
      resetFormErrors()
      setCaseStudyFileError('الرجاء التأكد من رفع دراسة الجدوي')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        // create a new form data with files data
        const formData = new FormData()
        formData.append('multiple', 'true')

        file.forEach((singleFile, index) => formData.append(`file[${index}]`, singleFile))
        caseStudyfile.forEach((singleFile, index) =>
          formData.append(`caseStudyfile[${index}]`, singleFile)
        )

        // upload the project images to s3
        const {
          data: { shms_project_id, shms_project_images, shms_project_study_case }
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
            shms_project_available_stocks: projectAvailableStocks,
            shms_project_stock_price: stockPrice,
            shms_project_stock_profits: stockProfits,
            shms_project_description: projectDescription,
            shms_project_images,
            shms_project_study_case
          }
        )
        //getting response from backend
        const { data } = addProject

        // make sure to view the response from the data
        if (data.projectAdded === 1) {
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
          setIsDoneSubmitting(true)
        } else {
          setIsDoneSubmitting(false)
        }

        setTimeout(() => {
          // force reload the page
          window.location.reload()
        }, DEFAULT_DURATION)
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

  return (
    <TabsContent value='add_project'>
      <Card className='rtl'>
        <ProjectsTable />
        <Divider className='my-10' />
        <form onSubmit={e => handelAddProject(e)}>
          <CardHeader>
            <CardTitle>
              اضافة مشروع جديد
              <span className='text-red-500'>*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div
              className={`grid ${fileUploadGrid()} gap-y-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
            >
              <FileUpload
                data={{
                  defaultImg: [
                    { imgDisplayName: APP_TITLE, imgDisplayPath: APP_LOGO_sm }
                  ],
                  imgName: 'Agricultural Project View'
                }}
              />
            </div>
            {projectImagesError && <FormMessage error>{projectImagesError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='projectName'>
                اسم المشروع
                <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='projectName'
                type='text'
                onChange={e => setProjectName(e.target.value)}
              />
            </div>
            {projectNameError && <FormMessage error>{projectNameError}</FormMessage>}

            <div className='space-y-1'>
              <Label htmlFor='projectLocation'>
                منطقة المشروع
                <span className='text-red-500'>*</span>
              </Label>
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
              <Label htmlFor='projectStartDate'>
                تاريخ بداية المشروع
                <span className='text-red-500'>*</span>
              </Label>
              <div className='md:w-3/3'>
                <input
                  id='projectStartDate'
                  className='w-full rtl px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectStartDate(new Date(e.target.value))}
                />
              </div>
            </div>
            {projectStartDateError && (
              <FormMessage error>{projectStartDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectEndDate'>
                تاريخ نهاية المشروع
                <span className='text-red-500'>*</span>
              </Label>
              <div className='md:w-3/3'>
                <input
                  id='projectEndDate'
                  className='w-full rtl px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectEndDate(new Date(e.target.value))}
                />
              </div>
            </div>
            {projectEndDateError && (
              <FormMessage error>{projectEndDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectInvestEndDate'>
                اخر موعد للمساهمة
                <span className='text-red-500'>*</span>
              </Label>
              <div className='md:w-3/3'>
                <input
                  id='projectInvestEndDate'
                  className='w-full rtl px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='date'
                  onChange={e => setProjectInvestEndDate(new Date(e.target.value))}
                />
              </div>
            </div>
            {projectInvestEndDateError && (
              <FormMessage error>{projectInvestEndDateError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='projectAvailableStocks'>
                عدد الأسهم المتاحة
                <span className='text-red-500'>*</span>
              </Label>
              <div className='md:w-3/3'>
                <input
                  id='projectAvailableStocks'
                  className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='number'
                  inputMode='numeric'
                  min={0}
                  onChange={e => setProjectAvailableStocks(parseFloat(e.target.value))}
                  defaultValue={projectAvailableStocks}
                />
              </div>
            </div>
            {projectAvailableStocksError && (
              <FormMessage error>{projectAvailableStocksError}</FormMessage>
            )}

            <div className='space-y-1'>
              <Label htmlFor='stockPrice'>
                قيمة السهم الواحد
                <span className='text-red-500'>*</span>
              </Label>
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
              <Label htmlFor='stockProfits'>
                ارباح السهم الواحد
                <span className='text-red-500'>*</span>
              </Label>
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
              <Label htmlFor='projectDescription'>
                وصف المشروع
                <span className='text-red-500'>*</span>
              </Label>
              <textarea
                id='projectDescription'
                onChange={e => setProjectDescription(e.target.value)}
                className='w-full leading-10 px-4 py-2 text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                placeholder='أدخل وصف المشروع'
                rows={5}
              />
            </div>
            {projectDescriptionError && (
              <FormMessage error>{projectDescriptionError}</FormMessage>
            )}

            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='document'
                  className='block mb-1 font-bold text-gray-500 cursor-pointer md:text-right md:mb-0'
                >
                  دراسة الجدوى
                  <span className='text-red-500'>*</span>
                </label>
              </div>
              <div className='md:w-2/3'>
                <Input
                  id='document'
                  type='file'
                  aria-label='file'
                  accept='.pdf'
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded cursor-pointer dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  onChange={handleCaseStudyFileChange}
                  required
                />
              </div>
            </div>
            {caseStudyfileError && <FormMessage error>{caseStudyfileError}</FormMessage>}
          </CardContent>

          <CardFooter>
            <Button
              disabled={isDoneSubmitting}
              type='submit'
              variant={'pressable'}
              className={
                isDoneSubmitting
                  ? 'pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed'
                  : ''
              }
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
