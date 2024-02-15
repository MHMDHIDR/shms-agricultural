import { APP_LOGO, APP_TITLE, APP_URL, SHMS_EMAIL, SHMS_PHONE } from '@/data/constants'
import { getProjectDate } from '@/lib/utils'
import type { generatePDFProps } from '@/types'
import puppeteer from 'puppeteer'

function generatePDFContent({
  investorName,
  projectName,
  stocksPurchased,
  totalAmount,
  totalProfit,
  profitsCollectDate,
  referenceCode
}: generatePDFProps) {
  return `
<div style="max-width: 750px; padding: 10px; margin: 0 auto; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  <div style="display: flex; justify-content: space-between; align-items: center; direction: rtl; text-align: right; color: #333; user-select: none;">
    <div>
      <!-- Company logo -->
      <img src="${APP_LOGO}" height="100" width="150" alt="${APP_TITLE}" style="width: 150px; height: 100px; margin-inline: auto;">
    </div>

    <div style="text-align: center;">
      <h1>${APP_TITLE}</h1>
      <p style="font-size: 12px; color: #ccc;">${SHMS_EMAIL}</p>
      <p style="font-size: 12px; color: #ccc; direction: ltr;">${SHMS_PHONE}</p>
    </div>
  </div>

  <!-- Client info -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; direction: rtl; text-align: right;">
    <div>
      <p style="font-weight: bold; color: #333;">عقد استثمار شراء أسهم</p>
      <p style="color: #333;">${investorName}</p>
      <p style="font-weight: bold; color: #2a9d8f;">${projectName}</p>
    </div>

    <div style="text-align: right;">
      <p style="color: #333;">تاريخ الإنشاء: <span style="color: #333;">${getProjectDate(
        new Date()
      )}</span></p>
    </div>
  </div>

  <!-- Invoice Items -->
  <div style="margin-top: 20px;">
    <table style="width: 100%; border-collapse: collapse; border-radius: 10px; border: 1px solid #ccc;">
      <!-- Table Headers -->
      <thead style="background-color: #f8f9fa;">
        <tr>
          <th style="padding: 10px; text-align: right; font-weight: bold; color: #333;">اسم المشروع</th>
          <th style="padding: 10px; text-align: right; font-weight: bold; color: #333;">عدد الأسهم</th>
          <th style="padding: 10px; text-align: right; font-weight: bold; color: #333;">إجمالي الدفع</th>
          <th style="padding: 10px; text-align: right; font-weight: bold; color: #333;">الأرباح</th>
          <th style="padding: 10px; text-align: right; font-weight: bold; color: #333;">تاريخ استلام الأرباح</th>
        </tr>
      </thead>
      <tbody>
        <!-- Invoice Items -->
        <tr>
          <td style="padding: 10px; text-align: right; color: #333;">${projectName}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${stocksPurchased}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${totalAmount}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${totalProfit}</td>
          <td style="padding: 10px; text-align: right; color: #333;">${getProjectDate(
            new Date(profitsCollectDate)
          )}</td>
        </tr>
      </tbody>
    </table>
    <p style="margin-block: 20px; padding-top: 20px; text-align: right; font-size: 15px; color: #666;">هذا العقد يشهد على شراء عدد <strong>${stocksPurchased}</strong> من أسهم مشروع ${projectName}</p>
    <p style="margin-block: 20px; padding-top: 20px; text-align: right; font-size: 15px; color: #333;">تم شراء الأسهم بمبلغ
     <strong style="color: #2a9d01;font-weight: bold;text-decoration: underline;">${totalAmount} ريال قطري فقط</strong>
     وتم ذلك في تاريخ ${getProjectDate(new Date())}</p>
    <p style="margin-block: 20px; padding-top: 20px; text-align: right; font-size: 15px; color: #333;">وسيتم تسليم الأرباح في تاريخ ${
      profitsCollectDate ? getProjectDate(new Date(profitsCollectDate)) : 'غير محدد'
    }</p>
  </div>

  <!-- Reference Code -->
  <div style="direction: rtl; text-align: right; margin-top: 400px;">
    <p style="color: #666; font-size: 10px;">
      الرقم المرجعي
      <br>
      <span style="color: #ccc;">
        ${referenceCode}
      </span>
    </p>
  </div>

  <!-- Footer -->
  <div style="border-top: 1px solid #ccc; padding-top: 7px; font-size: 12px; color: #ccc; text-align: center;">
    <p style="margin-top: 30px; color: #666; font-size: 15px;">&copy; ${new Date().getFullYear()} ${APP_TITLE}</p>
    <span style="color: #999; font-size: 15px;">${APP_URL}</span>
    <span style="color: #666; font-size: 15px;">جميع الحقوق محفوظة</span>
  </div>

</div>
  `
}

export async function generatePDF({
  investorName,
  projectName,
  stocksPurchased,
  totalAmount,
  totalProfit,
  profitsCollectDate,
  referenceCode
}: generatePDFProps) {
  const htmlContent = generatePDFContent({
    investorName,
    projectName,
    stocksPurchased,
    totalAmount,
    totalProfit,
    profitsCollectDate,
    referenceCode
  })

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necessary for running Puppeteer in Lambda
  })
  const page = await browser.newPage()
  await page.setContent(htmlContent)

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  return pdfBuffer
}
