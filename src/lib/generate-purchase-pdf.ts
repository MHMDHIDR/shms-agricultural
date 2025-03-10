import puppeteer from "puppeteer-core"
import { env } from "@/env"
import { APP_CURRENCY, APP_TITLE } from "./constants"
import { formatDate } from "./format-date"
import type { Projects, User } from "@prisma/client"

export type PurchaseDetails = {
  stocks: number
  newPercentage: number
  totalPayment: number
  totalProfit: number
  totalReturn: number
  createdAt: string
}

export async function generatePurchasePDF(
  user: User,
  project: Projects,
  purchaseDetails: PurchaseDetails,
): Promise<Buffer> {
  let browser = null
  try {
    // Set a connection timeout in the URL with a longer timeout for production
    const browserWSEndpoint = `wss://chrome.browserless.io?token=${env.BROWSERLESS_API_KEY}&timeout=120000`

    browser = await puppeteer.connect({
      browserWSEndpoint,
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })

    // Set a longer navigation timeout
    page.setDefaultNavigationTimeout(60000)

    // Optimize page for PDF generation
    await page.emulateMediaType("screen")

    // Simplified content with fewer external resources
    const content = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            direction: rtl;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
          }
          th {
            background-color: #007ee6;
            color: white;
          }
        </style>
      </head>
      <body>
        <h1 style="text-align: center">${APP_TITLE} - عقد شراء أسهم</h1>

        <p style="text-align: left">تاريخ: ${new Date().toLocaleDateString("ar-QA")}</p>

        <h2>معلومات المستثمر:</h2>
        <p>الاسم: ${user.name}</p>
        <p>البريد الإلكتروني: ${user.email}</p>
        <p>رقم الهاتف: ${user.phone}</p>

        <h2>معلومات المشروع:</h2>
        <p>اسم المشروع: ${project.projectName}</p>

        <h2>تفاصيل الشراء:</h2>
        <table>
          <tr>
            <th>البيان</th>
            <th>القيمة</th>
          </tr>
          <tr>
            <td>عدد الأسهم</td>
            <td>${purchaseDetails.stocks}</td>
          </tr>
          <tr>
            <td>سعر السهم</td>
            <td>${project.projectStockPrice} ${APP_CURRENCY}</td>
          </tr>
          <tr>
            <td>إجمالي الدفع</td>
            <td>${purchaseDetails.totalPayment} ${APP_CURRENCY}</td>
          </tr>
          <tr>
            <td>الربح المتوقع</td>
            <td>
              ${purchaseDetails.totalProfit} ${APP_CURRENCY}
              ${purchaseDetails.newPercentage > 0 ? ` (زيادة ${purchaseDetails.newPercentage}%)` : ""}
            </td>
          </tr>
          <tr>
            <td>العائد الإجمالي</td>
            <td>${purchaseDetails.totalReturn} ${APP_CURRENCY}</td>
          </tr>
          <tr>
            <td>تاريخ الشراء</td>
            <td>${formatDate({ date: purchaseDetails.createdAt, isFullTimestamp: true })}</td>
          </tr>
        </table>

        <h2>شروط المشروع:</h2>
        <div>${project.projectTerms ?? "لا توجد شروط محددة"}</div>

        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div>توقيع المستثمر: ________________</div>
          <div>توقيع الشركة: ________________</div>
        </div>
      </body>
      </html>
    `

    // Set a longer timeout for content loading
    await page.setContent(content, { timeout: 60000 })

    // Set a longer timeout for PDF generation and optimize for size
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      timeout: 120000,
    })

    return Buffer.from(pdf)
  } catch (error) {
    console.error("Error generating PDF:", error)
    // Return a simple fallback PDF if generation fails
    return createFallbackPDF(user, project, purchaseDetails)
  } finally {
    if (browser) {
      try {
        await browser.close()
      } catch (error) {
        console.error("Error closing browser:", error)
      }
    }
  }
}

// Create a simple fallback PDF without using Puppeteer
function createFallbackPDF(
  user: User,
  project: Projects,
  purchaseDetails: PurchaseDetails,
): Buffer {
  // This is a very simple PDF content
  const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 595 842] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 6 0 R >> >>
endobj
5 0 obj
<< /Length 271 >>
stream
BT
/F1 12 Tf
50 800 Td
(${APP_TITLE} - Purchase Contract) Tj
0 -20 Td
(Investor: ${user.name}) Tj
0 -20 Td
(Project: ${project.projectName}) Tj
0 -20 Td
(Stocks: ${purchaseDetails.stocks}) Tj
0 -20 Td
(Total Payment: ${purchaseDetails.totalPayment} ${APP_CURRENCY}) Tj
0 -20 Td
(Total Return: ${purchaseDetails.totalReturn} ${APP_CURRENCY}) Tj
ET
endstream
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
0000000259 00000 n
0000000582 00000 n
trailer
<< /Size 7 /Root 1 0 R >>
startxref
649
%%EOF
  `
  return Buffer.from(pdfContent)
}
