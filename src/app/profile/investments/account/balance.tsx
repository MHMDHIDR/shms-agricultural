import { Button } from '@/components/ui/button'
import { formattedPrice } from '@/libs/utils'
import Link from 'next/link'
import type { Users } from '@prisma/client'

export default function Balance({
  totalAmount,
  withdrawableAmount,
  noWithdrawButton
}: {
  totalAmount: Users['shms_user_total_balance']
  withdrawableAmount: Users['shms_user_withdrawable_balance']
  noWithdrawButton?: boolean
}) {
  return (
    <div className='select-none grid grid-cols-1 gap-4 md:grid-cols-2'>
      {/* First Grid Item */}
      <div className='space-y-2 divide-y divide-gray-300'>
        <h1 className='text-lg font-bold'>الرصيد الكلي</h1>
        <h3 className='py-4 text-3xl font-bold'>{formattedPrice(totalAmount ?? 0)}</h3>
      </div>

      {/* Second Grid Item */}
      <div className='space-y-2 divide-y divide-gray-300'>
        <h1 className='text-lg font-bold'>الرصيد القابل للسحب</h1>
        <h3 className='py-4 text-3xl font-bold'>
          {formattedPrice(withdrawableAmount ?? 0)}
        </h3>
        {!noWithdrawButton && (
          <Link href={'/profile/investments/withdraw'} className='border-none'>
            <Button variant={'pressable'}>سحب الرصيد</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
