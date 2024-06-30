import { useContext } from 'react'
import Confirm from '@/components/custom/Confirm'
import { Error, Success } from '@/components/icons/Status'
import { Button } from '@/components/ui/button'
import { Card, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  API_URL,
  APP_LOGO_sm,
  APP_TITLE,
  DEFAULT_DURATION,
  FILE_UPLOAD_IMG_SIZE
} from '@/data/constants'
import { FileUploadContext } from '@/providers/FileUpload'
import axios from 'axios'
import Image from 'next/image'
import { toast } from 'sonner'
import type { FileUploadComponentProps, FileUploadProps, imgsProps } from '@/types'
import type { Projects } from '@prisma/client'

const FileUpload = ({
  data,
  ignoreRequired = false,
  id,
  setIsRefetching
}: FileUploadComponentProps) => {
  const { file, fileURLs, onFileRemove, onFileAdd } =
    useContext<FileUploadProps>(FileUploadContext)

  const handleDeleteProjectImg = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    const AWS_URI_END = `amazonaws.com`
    const { id: imageDisplayPath } = e.target as HTMLButtonElement
    const imageId = imageDisplayPath.split(AWS_URI_END)[1] as string
    const { shmsProjectImages } = e.currentTarget.dataset as { shmsProjectImages: string }
    const projectId = imageId.split('-SHMS-')[1]
    const imgToDelete = imageId.split(`${projectId}/`)[1]

    // remove the deleted image using imageId from shmsProjectImages array
    // and return the new array without the deleted image
    const shms_project_images: imgsProps[] = JSON.parse(shmsProjectImages).filter(
      (img: imgsProps) => img.imgDisplayName !== imgToDelete
    )

    try {
      // delete user document from s3 bucket
      const {
        data: { docDeleted }
      }: { data: { docDeleted: boolean } } = await axios.delete(
        decodeURI(`${API_URL}/deleteFromS3/${imageId.split(`${projectId}/`)[1]}`),
        { data: { imageId: imageId.slice(1) } }
      )

      // update the project images array in the database
      const { data }: { data: Projects } = await axios.patch(
        `${API_URL}/projects/edit/${projectId}`,
        { shms_project_images, updateImg: true }
      )

      // make sure to view the response from the data
      if (data.projectUpdated === 1 && docDeleted) {
        toast('تم حذف صورة المشروع بنجاح 👍🏼', {
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

        setIsRefetching && setIsRefetching(true)
      } else {
        toast('حدث خطأ ما', {
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
    } catch (error) {
      toast('حدث خطأ ما', {
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

  return (
    <>
      {
        //if there's no image in Preview (fileURLs) AND no images in the data base
        data.defaultImg.length === 0 ||
        (fileURLs.length === 0 && data.defaultImg[0]?.imgDisplayName === APP_TITLE) ? (
          <div
            className={`flex col-span-full items-center gap-y-3 max-h-44 h-44 place-content-center`}
          >
            <Image
              priority={true}
              src={APP_LOGO_sm}
              alt={APP_TITLE}
              height={FILE_UPLOAD_IMG_SIZE}
              width={FILE_UPLOAD_IMG_SIZE}
              className='object-cover w-32 h-32 p-1 border border-gray-400 min-h-fit dark:border-gray-300 rounded-xl'
            />
          </div>
        ) : //if there's image in Preview (fileURLs)
        fileURLs.length > 0 ? (
          fileURLs.map((fileURL: string, index: number) => (
            <div
              key={fileURL}
              className={`flex items-center flex-col gap-y-3 max-h-44 h-44 place-content-center`}
            >
              <Image
                src={fileURL}
                alt={data?.imgName ?? APP_TITLE}
                height={FILE_UPLOAD_IMG_SIZE}
                width={FILE_UPLOAD_IMG_SIZE}
                className={`object-cover p-1 border border-gray-400 max-w-[7rem] w-32 min-h-fit h-32 dark:border-gray-300 rounded-xl`}
              />
              <Button
                type='button'
                variant={'destructive'}
                onClick={() => onFileRemove(fileURL, file[index]?.name ?? '')}
              >
                حذف
              </Button>
            </div>
          ))
        ) : data.defaultImg.length > 0 &&
          data.defaultImg[0]?.imgDisplayName !== APP_TITLE ? (
          //if there're existing images in the data base
          data.defaultImg.map(
            ({ imgDisplayName, imgDisplayPath }: imgsProps, idx: number) => (
              <div
                className={`flex flex-col items-center gap-y-3 max-h-44 h-44 place-content-center`}
                key={data.projectId! + idx}
              >
                <Image
                  src={imgDisplayPath ?? APP_LOGO_sm}
                  alt={imgDisplayName ?? APP_TITLE}
                  height={FILE_UPLOAD_IMG_SIZE}
                  width={FILE_UPLOAD_IMG_SIZE}
                  priority={true}
                  className='object-cover w-32 h-32 p-1 border border-gray-400 min-h-fit dark:border-gray-300 rounded-xl'
                />
                <Confirm
                  imageId={imgDisplayPath}
                  shmsProjectImages={JSON.stringify(data.defaultImg)}
                  variant={'destructive'}
                  onClick={handleDeleteProjectImg}
                  message='هل أنت متأكد من حذف هذه الصورة؟'
                >
                  حذف
                </Confirm>
              </div>
            )
          )
        ) : (
          <Card className='col-span-full bg-destructive'>
            <CardDescription className='flex items-center justify-center py-4 text-lg font-bold text-white select-none'>
              <Error className='w-8 h-8 ml-4' />
              هنالك خلل في عرض صور لهذا المشروع 😕
            </CardDescription>
          </Card>
        )
      }

      {/* Label and Input */}
      <Label
        htmlFor='projectImg'
        className={`grid col-span-full h-fit place-items-center justify-center gap-5 p-3 overflow-y-auto border border-gray-200 hover:bg-gray-100 rounded-lg cursor-pointer dark:bg-gray-700 hover:dark:bg-gray-600 transition-colors duration-300`}
      >
        {id && fileURLs.length > 0 && (
          <p className='text-center text-green-700 dark:text-green-400'>
            لا تنسى الضغط على زر حفظ التعديلات في أسفل النموذج لحفظ{' '}
            <strong>الصور الجديدة</strong>
          </p>
        )}

        <Button className='pointer-events-none'>
          تم إختيار
          <span className='px-4 text-lg font-bold text-white'>{file.length ?? 0}</span>
          {file.length > 1 ? 'صور' : 'صورة'}
        </Button>

        <input
          type='file'
          name='projectImg'
          id='projectImg'
          className='hidden p-3 text-lg text-white bg-green-800 cursor-pointer transition-colors rounded-xl hover:bg-green-700'
          accept='image/*'
          onChange={onFileAdd}
          multiple
          required={!ignoreRequired}
        />
      </Label>
    </>
  )
}

export default FileUpload
