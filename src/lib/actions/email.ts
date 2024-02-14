'use server'

import { Resend, type CreateEmailResponse } from 'resend'
import { ADMIN_EMAIL, SHMS_EMAIL as shmsEmail } from '@/data/constants'
import { EmailTemplate } from '@/components/custom/email-template'
import type { emailMethodProps } from '@/types'

const { RESEND_API_KEY, SHMS_EMAIL } = process.env

async function email({ name, subject, from, to, msg }: emailMethodProps) {
  const resend = new Resend(RESEND_API_KEY)
  const { data, error: cause }: CreateEmailResponse = await resend.emails.send({
    to,
    from: `"${name ?? 'شمس للخدمات الزراعية | SHMS Agriculture'}" <${
      SHMS_EMAIL ?? shmsEmail
    }>`,
    subject,
    reply_to: from ?? ADMIN_EMAIL,
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
