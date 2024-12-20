'use server'

import { Resend } from 'resend'
import { ADMIN_EMAIL, SHMS_EMAIL } from '@/data/constants'
import { EmailTemplate } from '@/components/custom/email-template'
import type { CreateEmailResponse, emailMethodProps } from '@/types'

const { RESEND_API_KEY } = process.env

async function email({ name, subject, from, to, msg }: emailMethodProps) {
  const resend = new Resend(RESEND_API_KEY)

  const { data, error: cause }: CreateEmailResponse = await resend.emails.send({
    to,
    from: `"${name ?? 'شمس للخدمات الزراعية | SHMS Agriculture'}" <${
      SHMS_EMAIL ?? 'info@shmsagricultural.com'
    }>`,
    subject,
    replyTo: from ?? ADMIN_EMAIL,
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
