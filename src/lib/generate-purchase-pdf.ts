import puppeteer from "puppeteer-core"
import { env } from "@/env"
import { APP_CURRENCY, APP_TITLE } from "./constants"
import { formatDate } from "./format-date"
import type { Projects, User } from "@prisma/client"

type PurchaseDetails = {
  stocks: number
  newPercentage: number
  totalPayment: number
  totalProfit: number
  totalReturn: number
  createdAt: Date
}

export async function generatePurchasePDF(
  user: User,
  project: Projects,
  purchaseDetails: PurchaseDetails,
): Promise<Buffer> {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${env.BROWSERLESS_API_KEY}`,
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  const content = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap');
        body {
          font-family: 'Noto Naskh Arabic', Arial, sans-serif;
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
          <td>${formatDate({ date: purchaseDetails.createdAt.toISOString(), isFullTimestamp: true })}</td>
        </tr>
      </table>

      <h2>شروط المشروع:</h2>
      <div>${project.projectTerms}</div>

      <div style="margin-top: 40px; display: flex; justify-content: space-between;">
        <div>توقيع المستثمر: ________________</div>
        <div>توقيع الشركة: ________________</div>
      </div>
    </body>
    </html>
  `

  await page.setContent(content)
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "20px",
      bottom: "20px",
      left: "20px",
    },
  })

  await browser.close()
  return Buffer.from(pdf)
}
