'use client'

import Confirm from '@/components/custom/Confirm'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/custom/ConfirmDialog'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { redirect } from '@/lib/utils'
import { toast } from 'sonner'
import { Error, Success } from '@/components/icons/Status'
import { useState } from 'react'
import type { UserProps } from '@/types'
import axios from 'axios'

export default function UsersActions({ user }: { user: UserProps }) {
  const [userStockLimit, setUserStockLimit] =
    useState<UserProps['shms_user_stock_limit']>(1)
  const [userTotalBalance, setUserTotalBalance] =
    useState<UserProps['shms_user_total_balance']>(0)
  const [userTotalWithdrawableBalance, setUserTotalWithdrawableBalance] =
    useState<UserProps['shms_user_withdrawable_balance']>(0)

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })

  const deleteUser = async (id: string, S3docId: string) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })
      const { data }: { data: UserProps } = await axios.delete(
        `${API_URL}/users/delete/${id}`
      )

      // delete user document from s3 bucket
      const {
        data: { docDeleted }
      }: { data: { docDeleted: boolean } } = await axios.delete(
        decodeURI(`${API_URL}/deleteFromS3/${S3docId}`)
      )

      // make sure to view the response from the data
      if (data.userDeleted === 1 && docDeleted) {
        toast(data.message ?? 'تم حذف حساب المستخدم بنجاح 👍🏼', {
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
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
      console.error('Error =>', error)
    }
  }

  const toggleUserStatus = async (
    id: string,
    status: UserProps['shms_user_account_status']
  ) => {
    try {
      const { data }: { data: UserProps } = await axios.patch(
        `${API_URL}/users/toggleStatus/${id}`,
        { status }
      )

      if (data.userUpdated === 1) {
        toast(data.message ?? 'تم تحديث حالة المستخدم بنجاح 👍🏼', {
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
      }

      redirect('/dashboard/users')
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

  const updateUserStockLimitOrBalance = async (
    id: string,
    newValue: number,
    type: string
  ) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })
      const { data }: { data: UserProps } = await axios.patch(
        `${API_URL}/users/updateStockLimitOrBalance/${id}`,
        { newValue, type }
      )

      if (data.userUpdated === 1) {
        toast(
          data.message ??
            `تم تحديث ${
              type === 'stockLimit'
                ? 'حد شراء الأسهم'
                : type === 'totalBalance'
                ? 'الرصيد الكلي'
                : 'الرصيد القابل للسحب'
            } بنجاح 👍🏼 .. جاري تحويلك`,
          {
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
          }
        )
      } else {
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
      }

      redirect('/dashboard/users')
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
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className='border py-1.5 px-4 rounded-md hover:bg-gray-100 transition-colors'>
          الاجراء
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='flex flex-col gap-y-1.5'>
        <Confirm
          variant={'destructive'}
          onClick={async () => {
            await deleteUser(user.shms_id, user.shms_doc?.split('/').pop() ?? '')
          }}
          className='w-full'
          isLoading={formStatus.isSubmitting}
        >
          حذف
        </Confirm>
        <Confirm
          variant={'secondary'}
          onClick={async () => {
            await toggleUserStatus(
              user.shms_id,
              user.shms_user_account_status === 'block'
                ? 'active'
                : user.shms_user_account_status === 'pending'
                ? 'active'
                : 'block'
            )
          }}
          className='w-full bg-gray-200'
        >
          {user.shms_user_account_status === 'block'
            ? 'تفعيل'
            : user.shms_user_account_status === 'pending'
            ? 'تفعيل الحساب'
            : 'تعطيل'}
        </Confirm>
        <ConfirmDialog
          StockLimit={user.shms_user_stock_limit ?? 1}
          onClick={async () => {
            await updateUserStockLimitOrBalance(
              user.shms_id,
              userStockLimit!,
              'stockLimit'
            )
          }}
          onChange={e => setUserStockLimit(Number(e.target.value))}
          formStatus={formStatus}
        >
          حد شراء الاسهم
        </ConfirmDialog>
        <ConfirmDialog
          StockLimit={user.shms_user_total_balance ?? 1}
          onClick={async () => {
            await updateUserStockLimitOrBalance(
              user.shms_id,
              userTotalBalance!,
              'totalBalance'
            )
          }}
          onChange={e => setUserTotalBalance(Number(e.target.value))}
          formStatus={formStatus}
        >
          الرصيد الكلي
        </ConfirmDialog>
        <ConfirmDialog
          StockLimit={user.shms_user_withdrawable_balance ?? 1}
          onClick={async () => {
            await updateUserStockLimitOrBalance(
              user.shms_id,
              userTotalWithdrawableBalance!,
              'withdrawableBalance'
            )
          }}
          onChange={e => setUserTotalWithdrawableBalance(Number(e.target.value))}
          formStatus={formStatus}
        >
          الرصيد القابل للسحب
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
