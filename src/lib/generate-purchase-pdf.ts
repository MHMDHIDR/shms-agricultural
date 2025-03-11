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
  // Get the base URL from environment or use a default
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://www.shmsagricultural.com"

  // Full URLs for the logo
  const logoUrl = `${baseUrl}/logo-slogan.png`

  // First, fetch the logo and convert it to base64
  try {
    const logoResponse = await fetch(logoUrl)
    if (!logoResponse.ok) {
      throw new Error("Failed to fetch logo")
    }
    const logoBuffer = await logoResponse.arrayBuffer()
    const base64Logo = `data:image/png;base64,${Buffer.from(logoBuffer).toString("base64")}`

    const content = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap');

          @page {
            margin: 0;
            padding: 0;
            size: A4;
          }

          body {
            font-family: 'Noto Naskh Arabic', Arial, sans-serif;
            margin: 0;
            padding: 0;
            direction: rtl;
            position: relative;
            box-sizing: border-box;
            background: white;
          }

          .page {
            position: relative;
            width: 100%;
            min-height: 100vh;
            padding: 20mm;
            box-sizing: border-box;
            border: 10px double #007ee6;
            margin: 0;
            overflow: hidden;
          }

          .watermark {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 0;
            pointer-events: none;
          }

          .watermark::after {
            content: '';
            position: absolute;
            width: 45%;
            height: 45%;
            background-image: url('${base64Logo}');
            background-repeat: repeat;
            background-position: center;
            background-size: 80% auto;
            opacity: 0.03;
            transform: rotate(-45deg);
          }

          .content-wrapper {
            position: relative;
            z-index: 1;
            background: transparent;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .logo {
            width: 100px;
            height: auto;
          }

          .title {
            text-align: center;
            flex-grow: 1;
            font-size: 24px;
            font-weight: bolder;
            color: #007ee6;
            margin-right: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            position: relative;
            z-index: 2;
            background: white;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
            background: white;
          }

          th {
            background-color: #007ee6;
            color: white;
          }

          .signatures {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            position: relative;
            z-index: 2;
            background: white;
          }

          .company_signature {
            position: relative;
            min-width: 200px;
          }

          .stamp {
            position: absolute;
            top: -60px;
            right: 20px;
            width: 150px;
            height: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 4px double #0a5c2c;
            border-radius: 50%;
            color: #0a5c2c;
            font-size: 14px;
            line-height: 1.2;
            transform: rotate(-15deg);
            opacity: 0.8;
            background: rgba(10, 92, 44, 0.05);
            text-align: center;
            overflow: hidden;
          }

          .stamp::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 2px solid #0a5c2c;
            border-radius: 50%;
          }

          .stamp::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at center, transparent 0%, transparent 70%, rgba(10, 92, 44, 0.1) 100%);
            border-radius: 50%;
          }

          .stamp_content {
            position: relative;
            z-index: 1;
            font-weight: bold;
            padding: 10px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .stamp_logo_top {
            width: 40px;
            height: 40px;
            margin-bottom: 5px;
            background-image: url('${base64Logo}');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0.9;
          }

          .stamp_logo_bottom {
            width: 40px;
            height: 40px;
            margin-top: 5px;
            background-image: url('${base64Logo}');
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0.9;
            transform: rotate(180deg);
          }

          .stamp_title {
            font-size: 16px;
            margin-bottom: 5px;
            text-align: center;
            font-weight: bold;
          }

          .stamp_date {
            font-size: 12px;
            border-top: 1px solid #0a5c2c;
            border-bottom: 1px solid #0a5c2c;
            padding: 2px 0;
            width: 80%;
            text-align: center;
          }

          .stamp_border {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px dashed #0a5c2c;
            border-radius: 50%;
            margin: 10px;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="watermark"></div>
          <div class="content-wrapper">
            <div class="header">
              <img src="${base64Logo}" alt="${APP_TITLE}" class="logo" />
              <h1 class="title">${APP_TITLE} - عقد شراء أسهم</h1>
            </div>

            <p style="text-align: left; position: relative; z-index: 2">تاريخ: ${new Date().toLocaleDateString("ar-QA")}</p>

            <div style="position: relative; z-index: 2">
              <h2>معلومات المستثمر:</h2>
              <p>الاسم: ${user.name}</p>
              <p>البريد الإلكتروني: ${user.email}</p>
              <p>رقم الهاتف: ${user.phone}</p>

              <h2>معلومات المشروع:</h2>
              <p>اسم المشروع: ${project.projectName}</p>

              <h2>تفاصيل الشراء:</h2>
            </div>

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

            <div style="position: relative; z-index: 2">
              <h2>شروط المشروع:</h2>
              <div>${project.projectTerms}</div>
            </div>

            <div class="signatures">
              <div>توقيع المستثمر: ________________</div>
              <div class="company_signature">
                توقيع الشركة: ________________
                <div class="stamp">
                  <div class="stamp_content">
                    <div class="stamp_logo_top"></div>
                    <div class="stamp_title">${APP_TITLE}</div>
                    <div class="stamp_date">${formatDate({ date: purchaseDetails.createdAt.toISOString() })}</div>
                    <div class="stamp_logo_bottom"></div>
                  </div>
                  <div class="stamp_border"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Use the REST API instead of WebSocket connection
    const url = `https://chrome.browserless.io/pdf?token=${env.BROWSERLESS_API_KEY}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: content,
        options: {
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,
          margin: {
            top: "0mm",
            right: "0mm",
            bottom: "0mm",
            left: "0mm",
          },
          displayHeaderFooter: false,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Could not read error response body")
      console.error(
        `PDF generation failed with status ${response.status}: ${response.statusText}`,
        { errorText },
      )
      throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    return Buffer.from(buffer)
  } catch (error) {
    console.error("Error generating PDF:", error)
    if (error instanceof Error) {
      throw new Error(`PDF generation failed: ${error.message}`)
    } else {
      throw new Error(`PDF generation failed: Unknown error occurred`)
    }
  }
}
