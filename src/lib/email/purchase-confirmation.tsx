import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"
import { Resend } from "resend"
import { env } from "@/env"
import { ADMIN_EMAIL, APP_CURRENCY, APP_TITLE } from "@/lib/constants"
import { generatePurchasePDF } from "@/lib/generate-purchase-pdf"
import type { Projects, User } from "@prisma/client"
import type { CreateEmailResponse } from "resend"

const baseUrl = env.NEXT_PUBLIC_APP_URL

type PurchaseConfirmationEmailProps = {
  user: User
  project: Projects
  purchaseDetails: {
    stocks: number
    newPercentage: number
    totalPayment: number
    totalProfit: number
    totalReturn: number
    createdAt: Date
  }
}

export const PurchaseConfirmationEmail = ({
  user,
  project,
  purchaseDetails,
}: PurchaseConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>{APP_TITLE} | تأكيد شراء الأسهم</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={`${baseUrl}/logo-slogan.png`} width="40" height="33" alt={APP_TITLE} />
        <Section dir="rtl">
          <Text style={text}>مرحبا {user.name}،</Text>
          <Text style={text}>
            شكراً لاستثمارك في {project.projectName}. تم تأكيد عملية شراء الأسهم بنجاح.
          </Text>
          <Text style={text}>تفاصيل الشراء:</Text>
          <Text style={text}>• عدد الأسهم: {purchaseDetails.stocks}</Text>
          <Text style={text}>
            • سعر السهم: {project.projectStockPrice} {APP_CURRENCY}
          </Text>
          <Text style={text}>
            • إجمالي الدفع: {purchaseDetails.totalPayment} {APP_CURRENCY}
          </Text>
          <Text style={text}>
            • الربح المتوقع: {purchaseDetails.totalProfit} {APP_CURRENCY}
            {purchaseDetails.newPercentage > 0 && ` (زيادة ${purchaseDetails.newPercentage}%)`}
          </Text>
          <Text style={text}>
            • العائد الإجمالي: {purchaseDetails.totalReturn} {APP_CURRENCY}
          </Text>

          <Button style={button} href={`${baseUrl}/dashboard`}>
            عرض استثماراتي
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
)

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
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
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

const RESEND = new Resend(env.RESEND_API_KEY)

export const sendPurchaseConfirmationEmail = async ({
  user,
  project,
  purchaseDetails,
}: PurchaseConfirmationEmailProps): Promise<CreateEmailResponse> => {
  // Generate PDF
  const pdfBuffer = await generatePurchasePDF(user, project, purchaseDetails)

  return RESEND.emails.send({
    from: `${APP_TITLE} <${ADMIN_EMAIL}>`,
    to: user.email,
    subject: `${APP_TITLE} | تأكيد شراء الأسهم`,
    react: PurchaseConfirmationEmail({
      user,
      project,
      purchaseDetails,
    }),
    attachments: [
      {
        filename: `${project.projectName}-contract-${user.name}.pdf`,
        content: pdfBuffer,
      },
    ],
  })
}
