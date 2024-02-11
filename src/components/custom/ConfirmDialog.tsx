import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Success } from '../icons/Status'

export function ConfirmDialog({
  StockLimit = 1,
  onClick,
  onChange,
  formStatus,
  children
}: {
  StockLimit?: number
  onClick: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  formStatus: { isSubmitting: boolean; isSubmittingDone: boolean }
  children: React.ReactNode
}) {
  const { isSubmitting, isSubmittingDone } = formStatus

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>{children}</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] rtl'>
        <DialogHeader>
          <DialogTitle className='pb-4 font-bold text-center select-none'>
            تعديل الأسهم
          </DialogTitle>
          <DialogDescription className='text-right'>
            يمكنك تعديل الاسهم لهذا المستخدم، ثم الضغط على حفظ التغييرات
          </DialogDescription>
        </DialogHeader>
        <div className='py-4 grid gap-4'>
          <div className='items-center grid grid-cols-4 gap-4'>
            <Label htmlFor='stocks_limit' className='text-right'>
              عدد الأسهم
            </Label>
            <Input
              id='stocks_limit'
              defaultValue={StockLimit ?? 1}
              onChange={onChange}
              className='col-span-3'
              type='number'
              min={0}
              max={100}
              inputMode='numeric'
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            className={`ml-auto ${
              isSubmittingDone ? 'cursor-not-allowed opacity-75' : ''
            }`}
            onClick={onClick}
          >
            {isSubmitting ? (
              <>
                <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                جاري الحفظ ...
              </>
            ) : isSubmittingDone ? (
              <>
                <Success className='ml-3' />
                تم حفظ التعديلات
              </>
            ) : (
              'حفــظ'
            )}
          </Button>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              إغلاق
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
