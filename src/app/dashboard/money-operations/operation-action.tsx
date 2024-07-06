'use client'

import { useContext } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { Settings, Trash } from 'lucide-react'
import { FormStatusContext } from '@/providers/form-status'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Success, Error } from '@/components/icons/status'
import Confirm from '@/components/custom/confirm'
import type { accountingOperationsProps, FormStatusProps } from '@/types'

export default function OperationAction({
  withdrawAction
}: {
  withdrawAction: accountingOperationsProps
}) {
  const { formStatus, setFormStatus } = useContext<FormStatusProps>(FormStatusContext)

  const toggleWithdrawActionsStatus = async (
    operationId: string,
    userId: string,
    status: accountingOperationsProps['accounting_operation_status'] | null
  ) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })

      const { data }: { data: accountingOperationsProps } = await axios.patch(
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
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
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
    } finally {
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: false })
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
            withdrawAction.accounting_operation_status === 'pending' ||
            withdrawAction.accounting_operation_status === 'rejected'
              ? 'pressable'
              : 'secondary'
          }
          onClick={async () => {
            await toggleWithdrawActionsStatus(
              withdrawAction.shms_withdraw_id,
              withdrawAction.shms_user_id ?? '',
              withdrawAction.accounting_operation_status === 'pending' ||
                withdrawAction.accounting_operation_status === 'rejected'
                ? 'completed'
                : withdrawAction.accounting_operation_status === 'completed'
                ? 'rejected'
                : null
            )
          }}
          formStatus={formStatus}
        >
          {withdrawAction.accounting_operation_status === 'pending' ||
          withdrawAction.accounting_operation_status === 'rejected'
            ? 'قبول'
            : withdrawAction.accounting_operation_status === 'completed'
            ? 'رفـض'
            : ''}
          <Settings className='w-3 h-3 ml-3' />
        </Confirm>
        <Confirm
          variant={'destructive'}
          onClick={async () => {
            await toggleWithdrawActionsStatus(
              withdrawAction.shms_withdraw_id,
              withdrawAction.shms_user_id ?? '',
              'deleted'
            )
          }}
          formStatus={formStatus}
        >
          حــذف
          <Trash className='w-3 h-3 ml-3' />
        </Confirm>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
