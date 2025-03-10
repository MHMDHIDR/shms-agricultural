import { File, X } from "lucide-react"
import Image from "next/image"
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ConfirmationDialog } from "./confirmation-dialog"

export type UploadedFile = {
  imgDisplayName: string
  imgDisplayPath: string
}

type FileUploadProps = {
  onFilesSelected: (files: Array<File>) => void
  disabled?: boolean
  accept?: Record<string, string[]> | string
  maxFiles?: number
  className?: string
  isPreviewHidden?: boolean
  multiple?: boolean
  uploadedFiles?: UploadedFile[]
  fileType?: "image" | "studyCase"
  onDeleteUploadedFile?: (file: UploadedFile) => Promise<void>
}

function isImageFile(path: string) {
  // First try with regex
  const hasImageExtension = /\.(jpg|jpeg|png|webp|gif)$/i.test(path)
  if (hasImageExtension) return true

  // If regex fails, try checking if the URL contains image-related keywords
  const lowerPath = path.toLowerCase()
  return (
    lowerPath.includes("/images/") ||
    lowerPath.includes("/img/") ||
    lowerPath.includes("image") ||
    lowerPath.includes(".jpg") ||
    lowerPath.includes(".jpeg") ||
    lowerPath.includes(".png") ||
    lowerPath.includes(".webp") ||
    lowerPath.includes(".gif")
  )
}

export function FileUpload({
  onFilesSelected,
  disabled = false,
  accept,
  maxFiles,
  className,
  isPreviewHidden = false,
  multiple = false,
  uploadedFiles = [],
  fileType,
  onDeleteUploadedFile,
}: FileUploadProps) {
  const [previews, setPreviews] = useState<Array<{ url: string; name: string }>>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null)

  const clearPreviews = () => {
    previews.forEach(preview => URL.revokeObjectURL(preview.url))
    setPreviews([])
    onFilesSelected([])
  }

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index]!.url)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const handleDeleteUploadedFile = async () => {
    if (fileToDelete && onDeleteUploadedFile) {
      await onDeleteUploadedFile(fileToDelete)
      setFileToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      // Clear previous previews if not multiple
      if (!multiple) {
        previews.forEach(preview => URL.revokeObjectURL(preview.url))
        setPreviews([])
      }

      const newPreviews = acceptedFiles.map(file => ({
        url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        name: file.name,
      }))

      setPreviews(prev => (multiple ? [...prev, ...newPreviews] : newPreviews))
      onFilesSelected(acceptedFiles)
    },
    [multiple, onFilesSelected, previews],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      typeof accept === "string"
        ? { [accept]: [] }
        : (accept ?? { "image/*": [".jpeg", ".jpg", ".png", ".webp"] }),
    maxFiles: maxFiles ?? (multiple ? undefined : 1),
    disabled,
    multiple,
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={`relative rounded-lg border-2 border-dashed p-4 text-center ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"} ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary cursor-pointer"}`}
      >
        <input id="fileUploadInput" {...getInputProps()} />
        {isDragActive ? (
          <p>اسحب الملفات هنا...</p>
        ) : (
          <p>
            {multiple
              ? "اسحب وأفلت الملفات هنا، أو انقر للاختيار"
              : "اسحب وأفلت الملف هنا، أو انقر للاختيار"}
          </p>
        )}
        <small className="text-primary/75 text-xs">
          {accept ? (
            <p className="flex flex-col items-center justify-center gap-1">
              <span>يمكنك تحميل ملفات من نوع</span>
              <strong dir="ltr">{Object.values(accept).join(", ")}</strong>
            </p>
          ) : (
            "يمكنك تحميل أي نوع من الملفات"
          )}
        </small>
      </div>

      {!isPreviewHidden && (uploadedFiles.length > 0 || previews.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {/* Render uploaded files */}
          {uploadedFiles.map(file => (
            <div
              key={file.imgDisplayPath}
              className="relative flex flex-wrap items-center gap-2.5 rounded-lg border p-1"
            >
              {isImageFile(file.imgDisplayPath) ? (
                <Image
                  src={file.imgDisplayPath}
                  alt={file.imgDisplayName}
                  className="min-h-12 max-h-12 min-w-12 max-w-12 rounded-lg object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <File className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  setFileToDelete(file)
                  setDeleteDialogOpen(true)
                }}
                className="absolute top-0 right-0 cursor-pointer rounded-full bg-red-400 p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}

          {/* Render preview files */}
          {previews.map((preview, index) => (
            <div
              key={preview.url || preview.name}
              className="relative flex flex-wrap items-center gap-2.5 rounded-lg border p-2"
            >
              {preview.url ? (
                <Image
                  src={preview.url}
                  alt={preview.name}
                  className="min-h-12 max-h-12 min-w-12 max-w-12 rounded-lg object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <File className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  removePreview(index)
                }}
                className="absolute top-0 right-0 cursor-pointer rounded-full bg-blue-400 p-1 hover:bg-blue-600"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!isPreviewHidden && previews.length > 0 && (
        <Button
          type="button"
          variant="destructive"
          onClick={e => {
            e.stopPropagation()
            clearPreviews()
          }}
          className="w-fit px-4 py-2 text-sm cursor-pointer"
        >
          مسح الكل
        </Button>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="تأكيد الحذف"
        description={`هل أنت متأكد أنك تريد حذف ${fileType === "studyCase" ? "ملف دراسة الجدوى" : "هذه الصورة"}؟`}
        buttonText="حذف"
        buttonClass="bg-red-500 hover:bg-red-600"
        onConfirm={handleDeleteUploadedFile}
      />
    </div>
  )
}
