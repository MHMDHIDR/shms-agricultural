import { connectDB } from '@/api/utils/db'
import { genSalt, hash } from 'bcryptjs'
import { ResultSetHeader } from 'mysql2/promise'
import email from '@/lib/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import type { UserProps } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const {
    shms_id,
    userFullName,
    nationality,
    dateOfBirth,
    address,
    email: newUserEmail,
    phone,
    password,
    shms_doc
  } = body

  if (newUserEmail === '' || phone === '') {
    return new Response(
      JSON.stringify({ userAdded: 0, message: 'Please Fill In  All The Fields' }),
      { status: 400 }
    )
  }

  try {
    // Check if user exists
    const userExists = (await connectDB(`SELECT * FROM users WHERE shms_email = ?`, [
      newUserEmail
    ])) as UserProps[]

    if (userExists.length > 0) {
      return new Response(
        JSON.stringify({
          userAdded: 0,
          message: `المستخدم مسجل بالفعل، إذا كنت أنت صاحب الحساب يرجى تسجيل الدخول، إذا كنت تواجه مشكلة في تسجيل الدخول يرجى التواصل مع الإدارة على ${ADMIN_EMAIL}`
        }),
        { status: 409 }
      )
    }

    // Hash password
    const salt = await genSalt(10)
    const hashedPassword = await hash(password, salt)

    const userCanResetPasswordUntil = new Date(Date.now() + 3600000).toISOString() // 1 hour from signup time

    // create new user
    const newUser = await connectDB(
      `INSERT INTO users (shms_id, shms_fullname, shms_nationality, shms_date_of_birth, shms_address, shms_email, shms_phone, shms_password, shms_doc, shms_user_account_status, shms_user_reset_token_expires)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shms_id,
        userFullName,
        nationality,
        dateOfBirth,
        address,
        newUserEmail,
        phone,
        hashedPassword,
        shms_doc,
        'pending',
        userCanResetPasswordUntil
      ]
    )

    const { affectedRows: isCreated } = newUser as ResultSetHeader

    if (isCreated) {
      //send the user an email with a link to activate his/her account
      const buttonLink = APP_URL + `/auth/activate/${shms_id}`

      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: newUserEmail,
        subject: 'تفعيل حسابك | شمس للخدمات الزراعية',
        msg: {
          title: 'مرحباً بك في شمس للخدمات الزراعية',
          msg: `
            مرحباً، ${userFullName}

             شكراً لتسجيلك في شمس للخدمات الزراعي،
             اذا كنت ترغب في تفعيل حسابك، يرجى الضغط على الرابط أدناه لتأكيد عنوان بريدك الإلكتروني:

          إذا كنت تعتقد أن هذا البريد الالكتروني وصلك بالخطأ، أو أن هنالك مشكلة ما، يرجى تجاهل هذا البريد من فضلك!
            `,
          buttonLink,
          buttonLabel: 'تفعيل حسابك'
        }
      }

      const data = await email(emailData)
      if (data?.id) {
        return new Response(
          JSON.stringify({
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
          { status: 500 }
        )
      }
    }
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userAdded: 0,
        message: 'User Not Added!, Please Try Again Later'
      }),
      { status: 500 }
    )
  }
}
