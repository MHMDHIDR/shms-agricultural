import { useContext } from 'react'
import Image from 'next/image'
import { FileUploadContext } from '@/providers/FileUpload'
import { FILE_UPLOAD_IMG_SIZE } from '@/data/constants'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type {
  FileUploadComponentProps,
  FileUploadProps /*, DocImgsProps*/
} from '@/types'

const FileUpload = ({
  data,
  ignoreDelete,
  ignoreRequired = false,
  id
}: FileUploadComponentProps) => {
  const { file, fileURLs, onFileRemove, onFileAdd } =
    useContext<FileUploadProps>(FileUploadContext)

  const hasImgs =
    (data.defaultImg[0]?.docImgDisplayName?.length ?? 0 > 0) ||
    (data.defaultImg[0]?.docImgDisplayPath?.length ?? 0 > 0)

  return (
    <>
      {
        //if there's no image in Preview (fileURLs) AND no images in the data base
        fileURLs.length === 0 && data.defaultImg?.length === 0 ? (
          <div className={`flex items-center gap-y-3 max-h-44 h-44 place-content-center`}>
            <Image
              loading='lazy'
              src={`https://source.unsplash.com/random?food`}
              alt={`Agricultural Project View`}
              height={FILE_UPLOAD_IMG_SIZE}
              width={FILE_UPLOAD_IMG_SIZE}
              className='object-cover p-1 border border-gray-400 w-28 min-h-fit h-28 dark:border-gray-300 rounded-xl'
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
                loading='lazy'
                src={fileURL}
                alt={data?.imgName ?? `Agricultural Project View`}
                height={FILE_UPLOAD_IMG_SIZE}
                width={FILE_UPLOAD_IMG_SIZE}
                className={`object-cover p-1 border border-gray-400 max-w-[7rem] w-28 min-h-fit h-28 dark:border-gray-300 rounded-xl`}
              />
              <button
                type='button'
                className='px-6 py-1 text-white transition-colors bg-red-500 rounded-full hover:bg-red-700'
                onClick={() => onFileRemove(fileURL, file[index]?.name ?? '')}
              >
                حذف
              </button>
            </div>
          ))
        ) : (
          data.defaultImg.map(
            (
              { docImgDisplayName, docImgDisplayPath }: any /*DocImgsProps*/,
              idx: number
            ) => (
              <div
                className={`flex items-center gap-y-3 max-h-44 h-44 place-content-center`}
                key={data.foodId! + idx}
              >
                <Image
                  loading='lazy'
                  src={docImgDisplayPath || `https://source.unsplash.com/random?tree`}
                  alt={docImgDisplayName || `Agricultural Project View`}
                  height={FILE_UPLOAD_IMG_SIZE}
                  width={FILE_UPLOAD_IMG_SIZE}
                  className='object-cover p-1 border border-gray-400 w-28 min-h-fit h-28 dark:border-gray-300 rounded-xl'
                />
                {hasImgs && !ignoreDelete && (
                  <button
                    type='button'
                    id='deleteImg'
                    className='px-6 py-1 text-white transition-colors bg-red-500 rounded-full hover:bg-red-700'
                    data-img-name={docImgDisplayName}
                  >
                    حذف
                  </button>
                )}
              </div>
            )
          )
        )
      }

      {/* Label and Input */}
      <Label
        htmlFor='projectImg'
        className={`grid col-span-full place-items-center justify-center gap-5 p-3 overflow-y-auto border border-gray-200 hover:bg-gray-100 rounded-lg cursor-pointer dark:bg-gray-700 hover:dark:bg-gray-600 transition-colors duration-300`}
      >
        {/* Getting the id from: { params }: { params: { id: string } } */}
        {id && (
          <p className='text-center text-green-700 dark:text-green-400'>
            لا تنسى الضغط على زر التحديث في أسفل النموذج لتحديث الصور
          </p>
        )}

        <Button>
          تم إختيار
          <span className='px-4 text-lg font-bold text-white'>{file.length ?? 0}</span>
          {file.length > 1 ? 'صور' : 'صورة'}
        </Button>

        <input
          type='file'
          name='projectImg'
          id='projectImg'
          className='hidden p-3 text-lg text-white transition-colors bg-green-800 cursor-pointer rounded-xl hover:bg-green-700'
          accept='image/*'
          onChange={onFileAdd}
          multiple
          required={ignoreRequired ? !ignoreRequired : true}
        />
      </Label>
    </>
  )
}

export default FileUpload
