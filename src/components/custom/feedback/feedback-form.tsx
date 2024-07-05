'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SheetClose, SheetFooter } from '@/components/ui/sheet'
import { DEFAULT_DURATION } from '@/data/constants'
import { Error } from '@/components/icons/status'
import type { ProjectPlannerAIEndpoint } from '@/types'
import type { Users } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function FeedbackForm({
  name,
  email
}: {
  name: Users['shms_fullname']
  email: Users['shms_email']
}) {
  const [feedback, setFeedback] = useState('')
  const [label, setLabel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)

    const response = await axios.post('https://projectplannerai.com/api/feedback', {
      projectId: 'j570e6arxv5pjg7gxgk4akkq356w9vsq',
      title: feedback?.split(' ').slice(0, 3).join(' '),
      label: label ?? 'featureRequest',
      feedback,
      name,
      email
    } as ProjectPlannerAIEndpoint)

    //getting response from backend
    const { message }: { message: string } = response.data
    setIsSubmitting(false)

    if (message === 'created') {
      toast('تم إرسال إقتراحك بنجاح، شكراً لك!', {
        icon: <Info className='text-blue-300' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl',
        duration: DEFAULT_DURATION / 2,
        style: {
          backgroundColor: '#F0FAF0',
          color: '#367E18',
          border: '1px solid #367E18',
          gap: '1.5rem',
          textAlign: 'justify'
        }
      })
    } else {
      toast('حدث خطأ ما، الرجاء المحاولة مرة أخرى', {
        icon: <Error className='text-red-400' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl',
        duration: DEFAULT_DURATION / 2,
        style: {
          backgroundColor: '#FDF0F0',
          color: '#C53030',
          border: '1px solid #C53030',
          gap: '1.5rem',
          textAlign: 'justify'
        }
      })
    }
  }

  return (
    <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='name' className='text-right'>
          الإســـــــــم
        </Label>
        <Input
          name='name'
          id='name'
          defaultValue={name}
          className='col-span-3'
          readOnly
        />
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
          readOnly
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='label' className='text-right'>
          نوع الإقتراح
        </Label>
        <Select
          dir='rtl'
          name='label'
          onValueChange={(value: string) => setLabel(value)}
          required
        >
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='إختيار نوع الطلب' />
          </SelectTrigger>
          <SelectContent className='z-[1001]'>
            <SelectGroup>
              <SelectItem value='issue'>مشكلة</SelectItem>
              <SelectItem value='idea'>فكرة جديدة</SelectItem>
              <SelectItem value='question'>سؤال</SelectItem>
              <SelectItem value='complaint'>شكوى</SelectItem>
              <SelectItem value='featureRequest'>طلب ميزة</SelectItem>
              <SelectItem value='other'>أخرى</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='feedback' className='text-right'>
          إقتراحــك
        </Label>
        <Textarea
          name='feedback'
          id='feedback'
          placeholder='أدخل إقتراحك هنا'
          className='col-span-3 resize-none'
          rows={10}
          required
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button
            type='submit'
            className='ml-auto pressable w-full'
            disabled={!feedback.trim() || !label || isSubmitting}
          >
            أرسل الإقتراح
          </Button>
        </SheetClose>
      </SheetFooter>
    </form>
  )
}
