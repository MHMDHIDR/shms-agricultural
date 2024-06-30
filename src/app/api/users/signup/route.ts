import client from '@/../prisma/prismadb'
import { genSalt, hash } from 'bcryptjs'
import email from '@/libs/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'

export async function POST(req: Request) {
  const body = await req.json()
  const {
    userFullName,
    nationality,
    dateOfBirth,
    address,
    email: newUserEmail,
    phone,
    password,
    shms_doc
  } = body

  if (!newUserEmail || !phone) {
    return new Response(
      JSON.stringify({ userAdded: 0, message: 'الرجاء تعبئة جميع الحقول المطلوبة' }),
      { status: 400 }
    )
  }

  try {
    // Check if user exists
    const userExists = await client.users.findUnique({
      where: { shms_email: newUserEmail }
    })

    if (userExists) {
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

    // get the last shms_sn from the users table
    const lastUser = await client.users.findFirst({
      select: { shms_sn: true },
      orderBy: { shms_sn: 'desc' }
    })

    // Increment the last shms_sn by 1
    const shms_sn = lastUser ? lastUser.shms_sn + 1 : 1

    // Create new user
    const newUser = await client.users.create({
      data: {
        shms_fullname: userFullName.trim(),
        shms_sn,
        shms_nationality: nationality,
        shms_date_of_birth: new Date(dateOfBirth),
        shms_address: address,
        shms_email: newUserEmail,
        shms_phone: phone,
        shms_password: hashedPassword,
        shms_doc,
        shms_user_account_status: 'pending',
        shms_user_reset_token_expires: userCanResetPasswordUntil
      }
    })

    // Send the user an email with a link to activate their account
    const buttonLink = `${APP_URL}/auth/activate/${newUser.id}`

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

    const emailResponse = await email(emailData)
    if (emailResponse?.id) {
      return new Response(
        JSON.stringify({
          userAdded: 1,
          message:
            'تم تسجيل حساب المستخدم بنجاح ، يرجى تفعيل حسابك من البريد الاكتروني المرسل لديك 👍🏼'
        }),
        { status: 201 }
      )
    } else {
      return new Response(
        JSON.stringify({
          userAdded: 0,
          message:
            'لم يتم إرسال البريد الإلكتروني للتفعيل، يرجى المحاولة مرة أخرى لاحقاً 🙁'
        }),
        { status: 500 }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        userAdded: 0,
        message: 'لم يتم تسجيل المستخدم، يرجى المحاولة مرة أخرى لاحقاً 🙁'
      }),
      { status: 500 }
    )
  }
}
