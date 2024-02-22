import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getAuth } from '@/lib/actions/auth'
import { getUser } from '@/lib/utils'
import { UserProps } from '@/types'
import Link from 'next/link'

export default async function Account() {
  const { userId } = await getAuth()
  const { shms_user_total_balance, shms_user_withdrawable_balance } = (await getUser(
    userId
  )) as UserProps

  return (
    <div className='flex flex-col items-center justify-center gap-5 mt-10 md:flex-row'>
      {/* First Card */}
      <Card className='flex-1 pt-10 pb-0 rtl'>
        {/* Added mr-4 for margin */}
        <CardContent className='text-center'>
          <div className='grid grid-cols-1 gap-4 select-none md:grid-cols-2'>
            {/* First Grid Item */}
            <div className='space-y-2 divide-y divide-gray-300'>
              <h1 className='text-lg font-bold'>الرصيد الكلي</h1>
              <h3 className='py-4 text-3xl font-bold' data-price>
                {shms_user_total_balance ?? 0}
              </h3>
            </div>

            {/* Second Grid Item */}
            <div className='space-y-2 divide-y divide-gray-300'>
              <h1 className='text-lg font-bold'>الرصيد القابل للسحب</h1>
              <h3 className='py-4 text-3xl font-bold' data-price>
                {shms_user_withdrawable_balance ?? 0}
              </h3>
              <Link href={'/profile/investments/withdraw'} className='border-none'>
                <Button variant={'pressable'}>سحب الرصيد</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Second Card (Smaller Card) */}
      <Card className='p-10 rtl'>
        {/* Reduced padding to make it smaller */}
        <CardContent className='flex flex-col items-center justify-center text-center'>
          <h1>الملف الشخصي</h1>

          <Link
            href='/profile'
            className='mt-10 w-fit py-2.5 px-6 rounded-md font-bold text-white bg-purple-500 shadow hover:bg-purple-400 focus:shadow-outline focus:outline-none'
          >
            تعديل الملف الشخصي
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
