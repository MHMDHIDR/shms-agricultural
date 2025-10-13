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
import { env } from "@/env"
import { APP_TITLE } from "@/lib/constants"

export type NewsletterEmailProps = {
  name: string | null | undefined
  subject: string
  customContent: string
  ctaUrl: string
  ctaButtonLabel?: string
}

export default function NewsletterEmailTemplate({
  name = "مشتركنا العزيز",
  subject,
  customContent,
  ctaUrl,
  ctaButtonLabel = "زيارة المنصة",
}: NewsletterEmailProps) {
  const baseUrl = env.NEXT_PUBLIC_APP_URL

  return (
    <Html dir="rtl" lang="ar">
      <Head />
      <Preview>
        {APP_TITLE} | {subject}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={`${baseUrl}/logo-slogan.png`} width="40" height="33" alt={APP_TITLE} />
          <Section dir="rtl">
            <Text style={text}>مرحبا {name}،</Text>
            <Text style={text}>نقدم لكم نشرة {APP_TITLE} مع آخر التحديثات والأخبار المهمة.</Text>

            {/* Custom content */}
            <div style={contentArea}>
              <div dangerouslySetInnerHTML={{ __html: customContent }} />
            </div>

            {/* CTA Button */}
            {ctaButtonLabel && (
              <Button style={button} href={ctaUrl}>
                {ctaButtonLabel}
              </Button>
            )}

            <Text style={text}>شكراً لثقتكم في {APP_TITLE}</Text>
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

const contentArea = {
  fontSize: "16px",
  lineHeight: "1.7",
  color: "#2d3748",
  marginBottom: "20px",
}
