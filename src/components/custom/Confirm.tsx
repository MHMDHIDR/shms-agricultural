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
import type { ConfirmProps } from '@/types'

export default function Confirm({
  message,
  onClick,
  variant,
  className,
  children,
  imageId,
  shmsProjectImages
}: ConfirmProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className='w-full'>
        <Button variant={variant} asSpan className={className}>
          {children ?? 'إجراء'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right select-none'>
            {message ?? 'هل أنت متأكد'}
          </AlertDialogTitle>
          <AlertDialogDescription className='text-right select-none'>
            هذا الإجراء لا يمكن إلغاؤه. هل أنت متأكد من أنك تريد الاستمرار؟
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
