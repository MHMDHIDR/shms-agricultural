'use client'

import { ConfirmDialog } from '@/components/custom/ConfirmDialog'
import { Success, Error } from '@/components/icons/Status'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { redirect } from '@/libs/utils'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Confirm from '@/components/custom/Confirm'
import type { Users, Stocks } from '@prisma/client'

export default function PurchasedStocks({
  purchesedStocks: { item, userId },
  children
}: {
  purchesedStocks: { item: Stocks; userId: Users['id'] }
  children: React.ReactNode
}) {
  const [userPurchasedStocks, setUserPurchasedStocks] =
    useState<Users['shms_user_stock_limit']>(1)

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })

  const updateUserPurchasedStocks = async (
    userId: string,
    dateOfPurchase: string | Date,
    stocks: number
  ) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })
      const { data }: { data: Users } = await axios.patch(
        `${API_URL}/users/updatePurchasedStocks/${userId}`,
        { dateOfPurchase, stocks }
      )

      if (data.userUpdated === 1) {
        toast(data.message ?? 'تم تحديث الاسهم بنجاح 👍🏼', {
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

      redirect('/dashboard', 1000)
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

  const deleteUserPurchasedStocks = async (
    userId: string,
    dateOfPurchase: string | Date
  ) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })
      const { data }: { data: Users } = await axios.patch(
        `${API_URL}/users/deletePurchasedStocks/${userId}`,
        { dateOfPurchase }
      )

      if (data.userUpdated === 1) {
        toast(data.message ?? 'تم حذف الاسهم بنجاح 👍🏼', {
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
        setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
      }

      redirect('/dashboard', 1000)
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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className='border py-1.5 px-4 rounded-md hover:bg-gray-100 transition-colors'>
          الاجراء
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='space-y-2 max-w-20'>
        {/* Delete Button */}
        <Confirm
          variant={'destructive'}
          onClick={async () => {
            await deleteUserPurchasedStocks(userId, item.createdAt)
          }}
          className='w-full'
          // isLoading={formStatus.isSubmitting}
        >
          حذف الأسهم
        </Confirm>
        <ConfirmDialog
          StockLimit={item.stocks}
          onClick={async () => {
            await updateUserPurchasedStocks(
              userId,
              item.createdAt,
              userPurchasedStocks ?? 0
            )
          }}
          onChange={e => setUserPurchasedStocks(Number(e.target.value))}
          formStatus={formStatus}
        >
          {children}
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
