import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'
import type { ConfirmProps } from '@/types'

export default function Confirm({
  message,
  isLoading,
  onClick,
  variant,
  className,
  children,
  imageId,
  shmsProjectImages,
  formStatus
}: ConfirmProps) {
  const { isSubmitting } = formStatus ?? {
    isSubmitting: false
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={`w-fit mx-auto${
          isLoading || isSubmitting
            ? ' cursor-progress opacity-75 pointer-events-none'
            : ''
        }`}
        disabled={isLoading || isSubmitting}
      >
        <Button
          variant={variant}
          className={cn(isSubmitting ? 'cursor-progress opacity-75' : '', className)}
          disabled={isSubmitting}
          asSpan
        >
          {children ?? 'إجراء'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right select-none'>
            {message ?? 'هل أنت متأكد'}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-right select-none'>
            هذا الإجراء لا يمكن إلغاؤه لاحقاً! هل أنت متأكد من أنك تريد الاستمرار؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClick}
            id={imageId}
            data-shms-project-images={shmsProjectImages}
          >
            متابعة
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
