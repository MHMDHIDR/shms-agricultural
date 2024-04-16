import { Card, CardContent } from '@/components/ui/card'
import { getAuth } from '@/lib/actions/auth'
import { getUser } from '@/lib/utils'
import { UserProps } from '@/types'
import Link from 'next/link'
import Balance from './_Balance'

export default async function Account({ userId }: { userId?: string | undefined }) {
  const { userId: currentUserId } = await getAuth()
  const { shms_user_total_balance, shms_user_withdrawable_balance, shms_fullname } =
    (await getUser(userId ?? currentUserId)) as UserProps

  return (
    <div className='flex flex-col items-center justify-center gap-5 mt-10 md:flex-row'>
      {/* First Card */}
      <Card className='flex-1 pt-10 pb-0 rtl'>
        {/* Added mr-4 for margin */}
        <CardContent className='text-center'>
          <Balance
            totalAmount={shms_user_total_balance}
            withdrawableAmount={shms_user_withdrawable_balance}
            noWithdrawButton={typeof userId !== 'undefined'}
          />
        </CardContent>
      </Card>

      {/* Second Card (Smaller Card) */}
      <Card className='p-10 rtl'>
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
