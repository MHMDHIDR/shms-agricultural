import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { submitFeedback } from '@/libs/actions/feedback'
import { Users } from '@prisma/client'
import { MessageCircleHeart } from 'lucide-react'

export default function Feedback({
  name,
  email
}: {
  name: Users['shms_fullname']
  email: Users['shms_email']
}) {
  return (
    <Sheet key={'right'}>
      <SheetTrigger className='cursor-pointer'>
        <MessageCircleHeart className='stroke-neutral-500 hover:stroke-neutral-700 dark:stroke-neutral-400 duration-200 dark:hover:stroke-white' />
      </SheetTrigger>
      <SheetContent side={'right'} className='z-[1000] rtl'>
        <SheetHeader className='mt-10'>
          <SheetTitle className='text-right'>قدم إقتراح هنا</SheetTitle>
          <SheetDescription className='text-right'>
            قم بتعبئة النموذج التالي لإرسال إقتراحك لتطوير المنصة
          </SheetDescription>
        </SheetHeader>
        <form className='grid gap-4 py-4' action={submitFeedback}>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              الإســــم
            </Label>
            <Input name='name' id='name' defaultValue={name} className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              البريد الالكتروني
            </Label>
            <Input
              name='email'
              id='email'
              type='email'
              defaultValue={email ?? ''}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='feedback' className='text-right'>
              إقتراحــك
            </Label>
            <textarea
              name='feedback'
              id='feedback'
              placeholder='أدخل إقتراحك هنا'
              className='col-span-3 resize-none p-2 rounded-md outline-current'
              rows={10}
            />
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button type='submit' className='ml-auto pressable w-full'>
                أرسل الإقتراح
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
