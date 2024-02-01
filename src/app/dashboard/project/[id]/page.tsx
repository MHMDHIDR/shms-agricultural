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
import { Switch } from '@/components/ui/switch'
import { API_URL, DEFAULT_DURATION, MAX_FILE_UPLOAD_SIZE } from '@/data/constants'
import { abstractWords, cn, getProjectStatus, validateFile } from '@/lib/utils'
import { FileUploadContext } from '@/providers/FileUpload'
import type { ProjectProps } from '@/types'
import { ReloadIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { ArrowBigRight } from 'lucide-react'
import Link from 'next/link'
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
  const [projectAvailableStocks, setProjectAvailableStocks] = useState<number>(0)
  const [stockPrice, setStockPrice] = useState<number>()
  const [stockProfits, setStockProfits] = useState<number>()
  const [projectDescription, setProjectDescription] = useState('')
  const [caseStudyfile, setCaseStudyFile] = useState<File[]>([])
  const [projectStatus, setProjectStatus] =
    useState<ProjectProps['shms_project_status']>('pending')

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
      setProjectAvailableStocks(project.shms_project_available_stocks)
      setStockPrice(project.shms_project_stock_price)
      setStockProfits(project.shms_project_stock_profits)
      setProjectDescription(project.shms_project_description)
      setCaseStudyFile(JSON.parse(String(project.shms_project_study_case)))
      setProjectStatus(project.shms_project_status)
    }

    getProjectDetails()
  }, [projectId])

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

  const handelEditProject = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    // check if the form is valid
    if (file.length === 0 && projectImages.length === 0) {
      resetFormErrors()
      setImagesNameError('الرجاء التأكد من رفع صور المشروع')
    } else if (!caseStudyfile) {
      resetFormErrors()
      setCaseStudyFileError('الرجاء التأكد من رفع دراسة الجدوى')
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
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)
        let newProjectImages: ProjectProps['shms_project_images'] = []

        if (file.length > 0) {
          // create a new form data with files data
          const formData = new FormData()
          formData.append('multiple', 'true') // for s3 to allow update multiple files
          formData.append('projectId', projectId)
          file.forEach((singleFile, index) =>
            formData.append(`file[${index}]`, singleFile)
          )
          // upload the project images to s3
          const {
            data: { shms_project_images }
          }: {
            data: ProjectProps
          } = await axios.post(`${API_URL}/uploadToS3`, formData)

          // getting response from backend
          newProjectImages = shms_project_images
        }

        const formData = new FormData()
        formData.append('multiple', 'true') // for s3 to allow update multiple files
        formData.append('projectId', projectId)
        caseStudyfile.forEach((singleFile, index) =>
          formData.append(`caseStudyfile[${index}]`, singleFile)
        )

        const {
          data: { shms_project_study_case }
        }: {
          data: ProjectProps
        } = await axios.post(`${API_URL}/uploadToS3`, formData)

        // upload the project data to the database
        const updatedProject: { data: ProjectProps } = await axios.patch(
          `${API_URL}/projects/edit/${projectId}`,
          {
            shms_project_images: [...projectImages, ...newProjectImages],
            shms_project_name: projectName,
            shms_project_location: projectLocation,
            shms_project_start_date: projectStartDate,
            shms_project_end_date: projectEndDate,
            shms_project_invest_date: projectInvestEndDate,
            shms_project_available_stocks: projectAvailableStocks,
            shms_project_stock_price: stockPrice,
            shms_project_stock_profits: stockProfits,
            shms_project_description: projectDescription,
            shms_project_study_case,
            shms_project_status: projectStatus
          }
        )
        //getting response from backend
        const { data } = updatedProject

        // make sure to view the response from the data
        data.projectUpdated === 1 &&
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

        data.projectUpdated === 1 ? setIsDoneSubmitting(true) : setIsDoneSubmitting(false)
        // setTimeout(() => {
        //   window.location.href = `/dashboard/project/${projectId}`
        // }, DEFAULT_DURATION)
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

  return (
    <Layout>
      <Card className='mt-56 rtl'>
        <Link
          href={`/dashboard`}
          className='underline-hover mt-4 mr-5 inline-block font-bold group text-blue-500'
        >
          <ArrowBigRight className='inline-block w-4 h-4 ml-0.5 group-hover:translate-x-2 transition-transform' />
          العودة للوحة التحكم
        </Link>
        <form onSubmit={e => handelEditProject(e)}>
          <CardHeader>
            <CardTitle className='select-none text-center'>
              تعديل مشروع{' '}
              <strong>
                {projectName && projectName.length > 0 ? (
                  abstractWords({ words: projectName, wordsLength: 4, ellipsis: true })
                ) : (
                  <Skeleton className='w-32 h-4 inline-block bg-gray-400' />
                )}
              </strong>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div
              className={`grid ${fileUploadGrid()} gap-y-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}
            >
              <FileUpload
                data={{ projectId, defaultImg: projectImages, imgName: projectName }}
                id={projectId}
                ignoreRequired={true}
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
              <Label htmlFor='projectAvailableStocks'>عدد الأسهم المتاحة</Label>
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

            <div className='space-y-1 flex gap-x-5 items-center'>
              <Label htmlFor='projectStatus' className='cursor-pointer'>
                حالة المشروع:
              </Label>
              <Switch
                id='projectStatus'
                dir='ltr'
                checked={projectStatus === 'active'}
                onCheckedChange={e => setProjectStatus(e ? 'active' : 'pending')}
              />
              <strong
                className={cn(
                  `select-none`,
                  projectStatus === 'active' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {getProjectStatus(projectStatus)}
              </strong>
            </div>
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
