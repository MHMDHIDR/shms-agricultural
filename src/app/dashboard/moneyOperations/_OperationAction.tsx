'use client'

import Confirm from '@/components/custom/Confirm'
import axios from 'axios'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { toast } from 'sonner'
import { Success, Error } from '@/components/icons/Status'
import type { withdrawActionsProps } from '@/types'

export default function OperationAction({
  children,
  withdrawAction
}: {
  children: string
  withdrawAction: withdrawActionsProps
}) {
  const toggleWithdrawActionsStatus = async (
    operationId: string,
    userId: string,
    status: withdrawActionsProps['withdraw_withdraw_status'] | null
  ) => {
    try {
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
    }
  }

  return (
    <Confirm
      variant={
        withdrawAction.withdraw_withdraw_status === 'pending'
          ? 'pressable'
          : 'destructive'
      }
      onClick={async () => {
        await toggleWithdrawActionsStatus(
          withdrawAction.shms_withdraw_id,
          withdrawAction.shms_user_id,
          withdrawAction.withdraw_withdraw_status === 'pending'
            ? 'completed'
            : withdrawAction.withdraw_withdraw_status === 'completed'
            ? 'rejected'
            : null
        )
      }}
    >
      {children}
    </Confirm>
  )
}
