'use client'

import { ConfirmDialog } from '@/components/custom/ConfirmDialog'
import { Success, Error } from '@/components/icons/Status'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { redirect } from '@/lib/utils'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import type { UserProps, stocksPurchasedProps } from '@/types'

export default function PurchasedStocks({
  purchesedStocks: { item, userId },
  children
}: {
  purchesedStocks: { item: stocksPurchasedProps; userId: UserProps['shms_id'] }
  children: React.ReactNode
}) {
  const [userPurchasedStocks, setUserPurchasedStocks] =
    useState<UserProps['shms_user_stock_limit']>(1)

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })

  const updateUserPurchasedStocks = async (id: string, stocks: number) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })
      const { data }: { data: UserProps } = await axios.patch(
        `${API_URL}/users/updatePurchasedStocks/${id}`,
        { stocks }
      )

      if (data.userUpdated === 1) {
        toast(data.message ?? 'تم تحديث حد شراء الاسهم بنجاح 👍🏼', {
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

      redirect('/dashboard', 1500)
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
    <ConfirmDialog
      StockLimit={item.stocks}
      onClick={async () => {
        await updateUserPurchasedStocks(userId, userPurchasedStocks ?? 0)
      }}
      onChange={e => setUserPurchasedStocks(Number(e.target.value))}
      formStatus={formStatus}
    >
      {children}
    </ConfirmDialog>
  )
}
