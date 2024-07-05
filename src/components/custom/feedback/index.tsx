import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { MyTooltip } from '@/components/ui/tooltip'
import { MessageCircleHeart } from 'lucide-react'
import FeedbackForm from './feedback-form'
import type { Users } from '@prisma/client'

export default function Feedback({
  children,
  name,
  email
}: {
  children?: string
  name: Users['shms_fullname']
  email: Users['shms_email']
}) {
  return (
    <Sheet key={'right'}>
      <SheetTrigger className='cursor-pointer'>
        <MyTooltip text='أضف إقتراحك'>
          <span className='flex gap-2 items-center'>
            {children}
            <MessageCircleHeart className='stroke-neutral-500 hover:stroke-neutral-700 dark:stroke-neutral-400 duration-200 dark:hover:stroke-white' />
          </span>
        </MyTooltip>
      </SheetTrigger>
      <SheetContent
        side={'right'}
        className='z-[1000] rtl w-full md:w-max  pr-10 md:pr-6'
      >
        <SheetHeader className='mt-10'>
          <SheetTitle className='text-right'>قدم إقتراح هنا</SheetTitle>
          <SheetDescription className='text-right'>
            قم بتعبئة النموذج التالي لإرسال إقتراحك لتطوير المنصة
          </SheetDescription>
        </SheetHeader>

        <FeedbackForm name={name} email={email} />
      </SheetContent>
    </Sheet>
  )
}
