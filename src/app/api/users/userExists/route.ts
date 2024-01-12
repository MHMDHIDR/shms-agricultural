import type { NextRequest } from 'next/server'
import { connectDB } from '../../utils/db'
import type { UserProps } from '@/types'

export async function GET(req: NextRequest) {
  const body = await req.json()
  const { shms_email }: UserProps = body

  const user: UserProps | null = await connectDB(`
  SELECT * FROM users WHERE shms_email = "${shms_email}"
  `)

  // Handle case when user is not found
  if (!user) return new Response(JSON.stringify({ user }))
  // If user is found, check if his/her account is active or blocked
  else if (user.userAccountStatus === 'block') {
    return new Response(
      JSON.stringify(
        {
          LoggedIn: 0,
          message: 'Your Account Has Been Blocked, Please Contact The Admin'
        },
        { status: 403 }
      )
    )
  } else {
    return new Response(
      JSON.stringify({
        LoggedIn: 1,
        message: `Logged In Successfully, Welcome Back To ${
          user.userAccountType === 'admin' ? 'The Dashboard' : 'Your Account'
        }`,
        _id: user.shms_id,
        userAccountType: user.userAccountType,
        userFullName: user.shms_fullname,
        userEmail: user.shms_email,
        userTel: user.shms_phone
      })
    )
  }
}
