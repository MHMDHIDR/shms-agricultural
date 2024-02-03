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

export function ConfirmDialog({
  StockLimit = 1,
  onClick,
  onChange
}: {
  StockLimit?: number
  onClick: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>حد شراء الاسهم</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] rtl'>
        <DialogHeader>
          <DialogTitle className='text-center font-bold select-none pb-4'>
            تعديل حد شراء الاأسهم
          </DialogTitle>
          <DialogDescription className='text-right'>
            يمكنك تعديل حد شراء الاسهم لهذا المستخدم، ثم الضغط على حفظ التغييرات
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='stocks_limit' className='text-right'>
              عدد الاأسهم
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
          <Button type='submit' className='ml-auto' onClick={onClick}>
            حفظ
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
