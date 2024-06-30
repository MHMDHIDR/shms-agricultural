import { Card, CardContent } from '@/components/ui/card'
import { getAuth } from '@/libs/actions/auth'
import { getUser } from '@/libs/utils'
import Link from 'next/link'
import Balance from './_Balance'
import type { Users } from '@prisma/client'

export default async function Account({ userId }: { userId?: string }) {
  const { userId: currentUserId } = await getAuth()
  const { shms_user_total_balance, shms_user_withdrawable_balance, shms_fullname } =
    (await getUser(userId ?? currentUserId)) as Users

  return (
    <div className='flex flex-col items-center justify-center mt-10 gap-5 md:flex-row'>
      <Card className='flex-1 w-full pt-10 pb-0 rtl md:w-fit'>
        <CardContent className='text-center'>
          <Balance
            totalAmount={shms_user_total_balance}
            withdrawableAmount={shms_user_withdrawable_balance}
            noWithdrawButton={typeof userId !== 'undefined'}
          />
        </CardContent>
      </Card>

      <Card className='w-full p-10 rtl md:w-fit'>
        <CardContent className='flex flex-col items-center justify-center text-center'>
          <h1 className='font-bold'>{shms_fullname}</h1>
          {!userId ? (
            <Link
              href='/profile'
              className='mt-10 w-fit py-2.5 px-6 rounded-md font-bold text-white bg-purple-500 shadow hover:bg-purple-400 focus:shadow-outline focus:outline-none'
            >
              تعديل الملف الشخصي
            </Link>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
