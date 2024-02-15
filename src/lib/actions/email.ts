'use server'

import { Resend } from 'resend'
import { ADMIN_EMAIL, APP_TITLE, SHMS_EMAIL as shmsEmail } from '@/data/constants'
import { EmailTemplate } from '@/components/custom/email-template'
import type { CreateEmailResponse, emailMethodProps } from '@/types'
import { arabicDate } from '../utils'

const { RESEND_API_KEY, SHMS_EMAIL } = process.env

async function email({ name, subject, from, to, msg, pdfToSend }: emailMethodProps) {
  const resend = new Resend(RESEND_API_KEY)
  const attachments = []

  // if we have a pdf to send, add it to the attachments
  if (pdfToSend) {
    attachments.push({
      content: pdfToSend,
      filename: `${APP_TITLE}-Invoice-Investment-${arabicDate(
        new Date().toLocaleDateString()
      )}.pdf`
    })
  }

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
    }) as React.ReactElement,
    attachments
  })

  if (cause) {
    throw new Error('Error sending email to user', { cause })
  }

  return data
}

export default email
