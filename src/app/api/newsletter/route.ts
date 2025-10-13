import { NextResponse } from "next/server"
import { Resend } from "resend"
import { env } from "@/env"
import { ADMIN_EMAIL, APP_TITLE } from "@/lib/constants"
import NewsletterEmailTemplate from "@/lib/email/newsletter"

const RESEND = new Resend(env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { recipients, subject, customContent, ctaUrl, ctaButtonLabel, attachments } =
      await request.json()

    const results = []

    for (const recipient of recipients) {
      const result = await RESEND.emails.send({
        from: `${APP_TITLE} <${ADMIN_EMAIL}>`,
        to: recipient.email,
        subject: `${APP_TITLE} | ${subject}`,
        react: NewsletterEmailTemplate({
          name: recipient.name,
          subject,
          customContent,
          ctaUrl,
          ctaButtonLabel,
        }),
        attachments,
      })
      results.push(result)
    }

    return NextResponse.json({ success: true, result: results[0] })
  } catch (error) {
    console.error("Newsletter sending error:", error)
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}
