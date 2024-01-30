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
import { Button, type ButtonProps } from '@/components/ui/button'

export default function Confirm({
  message,
  onClick,
  variant,
  children
}: {
  message?: string
  onClick: () => void
  variant?: ButtonProps['variant']
  children: string | React.ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant={variant}>{children ?? 'إجراء'}</Button>
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
          <AlertDialogAction onClick={onClick}>متابعة</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
