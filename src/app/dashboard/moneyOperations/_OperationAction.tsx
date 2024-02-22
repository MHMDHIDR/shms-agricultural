'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { toast } from 'sonner'
import { Success, Error } from '@/components/icons/Status'
import type { withdrawActionsProps } from '@/types'
import { redirect } from '@/lib/utils'
import { useState } from 'react'
import Confirm from '@/components/custom/Confirm'

export default function OperationAction({
  children,
  withdrawAction
}: {
  children: string
  withdrawAction: withdrawActionsProps
}) {
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })

  const toggleWithdrawActionsStatus = async (
    operationId: string,
    userId: string,
    status: withdrawActionsProps['withdraw_withdraw_status'] | null
  ) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })

      const { data }: { data: withdrawActionsProps } = await axios.patch(
        `${API_URL}/withdrawActions/update/${operationId}`,
        { userId, status }
      )

      if (data.withdrawUpdated === 1) {
        toast(data.message ?? 'تم تحديث حالة المعاملة بنجاح 👍🏼', {
          icon: <Success className='w-6 h-6 ml-3' />,
          position: 'bottom-center',
          className: 'text-right select-none rtl',
          duration: DEFAULT_DURATION,
          style: {
            backgroundColor: '#F0FAF0',
            color: '#367E18',
            border: '1px solid #367E18',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
        redirect('/dashboard')
      } else {
        toast('عفواً حدث خطأ ما أثناء تحديث حالة المعاملة', {
          icon: <Error className='w-6 h-6 ml-3' />,
          position: 'bottom-center',
          className: 'text-right select-none rtl',
          style: {
            backgroundColor: '#FFF0F0',
            color: '#BE2A2A',
            border: '1px solid #BE2A2A',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
      }
    } catch (error) {
      toast('حدث خطأ ما', {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl',
        style: {
          backgroundColor: '#FFF0F0',
          color: '#BE2A2A',
          border: '1px solid #BE2A2A',
          gap: '1.5rem',
          textAlign: 'justify'
        }
      })
      console.error('Error =>', error)
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className='border py-1.5 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800  transition-colors'>
          الاجراء
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='flex flex-col gap-y-4'>
        <Confirm
          variant={
            withdrawAction.withdraw_withdraw_status === 'pending' ||
            withdrawAction.withdraw_withdraw_status === 'rejected'
              ? 'pressable'
              : 'destructive'
          }
          onClick={async () => {
            await toggleWithdrawActionsStatus(
              withdrawAction.shms_withdraw_id,
              withdrawAction.shms_user_id,
              withdrawAction.withdraw_withdraw_status === 'pending' ||
                withdrawAction.withdraw_withdraw_status === 'rejected'
                ? 'completed'
                : withdrawAction.withdraw_withdraw_status === 'completed'
                ? 'rejected'
                : null
            )
          }}
          formStatus={formStatus}
        >
          {children}
        </Confirm>
        <Confirm
          variant={'destructive'}
          onClick={async () => {
            await toggleWithdrawActionsStatus(
              withdrawAction.shms_withdraw_id,
              withdrawAction.shms_user_id,
              'deleted'
            )
          }}
          formStatus={formStatus}
        >
          حذف العملية
        </Confirm>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
