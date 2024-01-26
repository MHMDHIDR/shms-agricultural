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
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

export default function Confirm({
  message,
  className,
  children
}: {
  message?: string
  className?: string
  children: string | React.ReactNode
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className={cn(className)}>{children ?? 'إجراء'}</Button>
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
          <AlertDialogAction>متابعة</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
