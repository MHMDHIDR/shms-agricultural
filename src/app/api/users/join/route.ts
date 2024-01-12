import type { NextRequest } from 'next/server'
import { connectDB } from '../../utils/db'
import type { UserProps } from '@/types'

export default async function POST(req: NextRequest) {
  const body = await req.json()
  const { userFullName, userEmail, userPhone, userPassword } = body

  if (
    userFullName === '' ||
    userEmail === '' ||
    userPhone === '' ||
    userPassword === ''
  ) {
    return new Response(
      JSON.stringify({ userAdded: 0, message: 'Please Fill All The Fields' }),
      { status: 400 }
    )
  }

  // Check if user exists
  const userExists = await connectDB(`
   SELECT * FROM users WHERE userEmail = "${userEmail}" OR userPhone = "${userPhone}"
  `)

  if (userExists) {
    return new Response(
      JSON.stringify({ userAdded: 0, message: 'User Already Exists' }),
      { status: 409 }
    )
  }

  // Generate a Hashed Password using Native Crypto Module
  const hashedPassword = await crypto.subtle.digest(
    'SHA-512',
    new TextEncoder().encode(userPassword)
  )

  // Create user
  const user: UserProps = await connectDB(`
   INSERT INTO users (shms_id, shms_fullname, shms_email, shms_phone, shms_password)
   VALUES ("${crypto.randomUUID()}",
   "${userFullName}",
   "${userEmail.trim().toLowerCase()}",
   "${userPhone}",
   "${hashedPassword}"
  )`)

  //if user is created successfully
  if (user) {
    return new Response(
      JSON.stringify({
        _id: user.shms_id,
        email: user.shms_email,
        tel: user.shms_phone,
        userAdded: 1,
        message: 'User Successfully Registered You Can Login 👍🏼'
      }),
      { status: 201 }
    )
  } else {
    return new Response(
      JSON.stringify({
        userAdded: 0,
        message: 'User Not Added!, Please Try Again Later'
      }),
      { status: 400 }
    )
  }
}
