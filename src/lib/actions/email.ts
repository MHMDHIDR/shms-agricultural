'use server'

import { Resend } from 'resend'
import { ADMIN_EMAIL } from '@/data/constants'
import type { emailMethodProps } from '@/types'
import { EmailTemplate } from '@/components/custom/email-template'

async function email({ name, subject, from, to, msg }: emailMethodProps) {
  to = to
  from = from ?? ADMIN_EMAIL
  name = name || to

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { data, error: cause }: any = await resend.emails.send({
    to,
    //info@shmsagricultural.com
    from: `"${name}" <onboarding@resend.dev>`,
    subject,
    react: EmailTemplate({
      title: msg.title ?? '',
      msg: msg.msg ?? '',
      buttonLink: msg.buttonLink ?? '',
      buttonLabel: msg.buttonLabel ?? ''
    }) as React.ReactElement
  })

  if (cause) {
    throw new Error('Error sending email to user', { cause })
  }

  return data
}

export default email
