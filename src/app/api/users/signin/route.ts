import { connectDB } from '../../utils/db'
import { compare } from 'bcryptjs'
import type { UserProps } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, phone, password, emailOrPhone } = body

  if (email === '' || phone === '') {
    return new Response(
      JSON.stringify({ userAdded: 0, message: 'Please Fill In  All The Fields' }),
      { status: 400 }
    )
  }

  // If user is found, check if his/her account is active or blocked
  try {
    // Check for user by using his/her email or Phoneephone number
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_email = ? OR shms_phone = ?`, [
        email ?? emailOrPhone,
        phone ?? emailOrPhone
      ])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(JSON.stringify({ loggedIn: 0, message: 'User not found' }))
    }

    if (user.shms_user_account_status === 'block') {
      return new Response(
        JSON.stringify({
          loggedIn: 0,
          message: 'Your Account Has Been Blocked, Please Contact The Admin'
        }),
        { status: 403 }
      )
    } else if (user.shms_user_account_status === 'pending') {
      return new Response(
        JSON.stringify({
          loggedIn: 0,
          message: 'Your Account Is Pending, Please Activate Your Account First'
        }),
        { status: 403 }
      )
    } else if (user && (await compare(password, user.shms_password!))) {
      return new Response(
        JSON.stringify({
          loggedIn: 1,
          fullname: user.shms_fullname,
          shms_email: user.shms_email,
          message: 'Successfully Logged In'
        })
      )
    } else {
      return new Response(
        JSON.stringify({
          loggedIn: 0,
          message: 'Invalid Email/Telephone Number Or Password'
        }),
        { status: 401 }
      )
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error during authorization')
  }
}
