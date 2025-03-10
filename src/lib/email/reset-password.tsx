import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"
import { Resend } from "resend"
import { env } from "@/env"
import { ADMIN_EMAIL, APP_TITLE } from "@/lib/constants"
import { getRemainTimeString } from "../get-remaining-time-string"
import type { CreateEmailResponse } from "resend"

const baseUrl = env.NEXT_PUBLIC_APP_URL

type ResetPasswordEmailProps = {
  userFirstname: string
  resetPasswordLink: string
  expiresIn: sendPasswordResetEmailProps["token"]["expiresIn"]
}

export const ResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
  expiresIn,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{APP_TITLE} | إستعادة كلمة المرور</Preview>
      <Body style={main}>
        <Container style={container}>
          <div className="mx-auto w-full">
            <Img src={`${baseUrl}/logo-slogan.svg`} width="40" height="33" alt={APP_TITLE} />
          </div>
          <Section dir="rtl" className="rtl">
            <Text style={text}>مرحبا {userFirstname}،</Text>
            <Text style={text}>
              شخص ما طلب مؤخرًا تغيير كلمة المرور لحساب {APP_TITLE} الخاص بك.
            </Text>
            <Button style={button} href={resetPasswordLink}>
              إعادة تعيين كلمة المرور
            </Button>
            <Text style={text}>إذا لم تكن أنت، فقط تجاهل واحذف هذه الرسالة.</Text>
            <Text style={text}>
              للحفاظ على أمان حسابك، يرجى عدم إعادة توجيه هذا البريد الإلكتروني
              <br />
              <small>
                ملاحظة: رابط إعادة تعيين كلمة المرور صالح لمدة{" "}
                <strong>{getRemainTimeString(expiresIn)}</strong> فقط.
              </small>
              <br />
              <Link style={anchor} href={`${baseUrl}/privacy`}>
                سياسة الخصوصية
              </Link>
            </Text>
            <Text style={text}>نتمنى لك يوم سعيد.</Text>
            <small>
              <span>&copy; 2023 - {new Date().getFullYear()} </span> {APP_TITLE}
            </small>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
}

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
}

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
}

const anchor = {
  textDecoration: "underline",
}

const RESEND = new Resend(env.RESEND_API_KEY)
const DOMAIN = env.NEXT_PUBLIC_APP_URL

type sendPasswordResetEmailProps = {
  username: string
  email: string
  token: {
    token: string
    expiresIn: number
  }
}

export const sendPasswordResetEmail = async ({
  username,
  email,
  token,
}: sendPasswordResetEmailProps): Promise<CreateEmailResponse> => {
  const resetLink = `${DOMAIN}/new-password/${token.token}`

  const emailResponse = await RESEND.emails.send({
    from: `${APP_TITLE} <${ADMIN_EMAIL}>`,
    to: email,
    subject: `${APP_TITLE} | إستعادة كلمة المرور`,
    react: ResetPasswordEmail({
      userFirstname: username,
      resetPasswordLink: resetLink,
      expiresIn: token.expiresIn,
    }),
  })

  return emailResponse
}
