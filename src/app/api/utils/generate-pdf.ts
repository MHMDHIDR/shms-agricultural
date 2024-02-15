import { APP_LOGO, APP_TITLE, SHMS_EMAIL, SHMS_PHONE } from '@/data/constants'
import { getProjectDate } from '@/lib/utils'
import type { generatePDFProps } from '@/types'
import puppeteer from 'puppeteer'

// generatePDFContent.js
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
    <div class="max-w-3xl p-20 mx-auto my-10 bg-white rounded shadow-sm" id="invoice">
      <div class="items-center grid grid-cols-2"
        style="direction: rtl; text-align: right; color: #333; user-select: none;"
      >
        <div>
          <!-- Company logo -->
          <img
            src="${APP_LOGO}"
            height={150}
            width={150}
            alt="${APP_TITLE}"
            style="width: 150px; height: 150px; margin-inline: auto;"
          />
        </div>

        <div class="text-center">
          <h1>
            ${APP_TITLE}
          </h1>
          <p class="text-xs text-gray-500" style="color:#ccc">
            ${SHMS_EMAIL}
          </p>
          <p class="text-xs text-gray-500" style="color:#ccc">
            ${SHMS_PHONE}
          </p>
        </div>
      </div>

      <!-- Client info -->
      <div class="items-center mt-8 grid grid-cols-2">
        <div>
          <p class="font-bold text-gray-800">
            عقد الاستثمار:
          </p>
          <p class="text-gray-500">
            ${investorName}
          </p>
          <p class="font-bold text-gray-500 text-green-600">
            ${projectName}
          </p>
        </div>

        <div class="text-right">
          <p>
            تاريخ الإنشاء: <span class="text-gray-500">
              ${getProjectDate(new Date())}
            </span>
          </p>
        </div>
      </div>

      <!-- Invoice Items -->
      <div class="mt-8 -mx-4 flow-root sm:mx-0">
        <table class="table min-w-full">
          <!-- Table Headers -->
          <colgroup>
            <col class="w-full sm:w-1/2">
            <col class="sm:w-1/6">
            <col class="sm:w-1/6">
            <col class="sm:w-1/6">
          </colgroup>
          <thead class="text-gray-900 border-b border-gray-300">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                اســــــــــــم المشـــــــــــــــروع
              </th>
              <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                عدد الأسهم
              </th>
              <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                إجمالي الدفع
              </th>
              <th scope="col" class="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                الأرباح
              </th>
              <th scope="col" class="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                تاريخ استلام الأرباح
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Invoice Items -->
            <tr class="border-b border-gray-200">
              <td class="py-5 pl-4 pr-3 text-sm max-w-0 leading-10 sm:pl-0">
               ${projectName}
              </td>
              <td class="px-3 py-5 text-sm text-right max-w-0 leading-10">
                ${stocksPurchased}
              </td>
              <td class="px-3 py-5 text-sm text-right max-w-0 leading-10">
                ${totalAmount}
              </td>
              <td class="px-3 py-5 text-sm text-right max-w-0 leading-10">
                ${totalProfit}
              </td>
              <td class="px-3 py-5 text-sm text-right max-w-0 leading-10">
                ${getProjectDate(new Date(profitsCollectDate))}
              </td>
            </tr>
          </tbody>
          <br><br><br><br>
          <p style="margin-top: 50px; text-align: justify; font-size: 15px; color: #666;">
            هذا العقد يشهد على شراء عدد ${stocksPurchased} من أسهم مشروع ${projectName}
          </p>
          <p class="text-gray-500">
            تم شراء الأسهم بمبلغ ${totalAmount} ريال قطري فقط، وتم ذلك في تاريخ ${getProjectDate(
    new Date()
  )}
          </p>
          <p class="text-gray-500">
            وسيتم تسليم الأرباح في تاريخ ${
              profitsCollectDate
                ? getProjectDate(new Date(profitsCollectDate))
                : 'غير محدد'
            }
          </p>
        </table>
      </div>

      <!-- Reference Code -->
      <div style="direction: rtl; text-align: right; margin-top: 2rem;">
        <p style="color: #666; font-size: 15px;">
          رقم العقد
          <br>
          <span class="text-gray-900">${referenceCode}</span>
        </p>
      </div>

      <!-- Footer -->
      <div style="color: #ccc; border-top: 1px solid #ccc; padding-top: 1rem; font-size: 12px">
        <p style="display:block;width: 100%; text-align: center; margin-top: 5rem; color: #666; font-size: 15px;">
          <span>&copy; ${new Date().getFullYear()} </span>
          <span>${APP_TITLE}</span>
        </p>
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
}: generatePDFProps): Promise<Buffer> {
  const htmlContent = generatePDFContent({
    investorName,
    projectName,
    stocksPurchased,
    totalAmount,
    totalProfit,
    profitsCollectDate,
    referenceCode
  })

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(htmlContent)

  // Generate PDF buffer
  const pdfBuffer = await page.pdf({ format: 'A4' })

  await browser.close()

  return pdfBuffer
}
