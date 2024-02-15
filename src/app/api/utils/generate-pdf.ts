import { APP_TITLE, SHMS_EMAIL, SHMS_PHONE } from '@/data/constants'
import { arabicDate } from '@/lib/utils'
import { generatePDFProps } from '@/types'
import puppeteer from 'puppeteer'

// generatePDFContent.js
function generatePDFContent(
  investorName: string,
  projectName: string,
  stocksPurchased: string,
  totalAmount: string
) {
  return `
    <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">

      <div class="grid grid-cols-2 items-center">
        <div>
          <!-- Company logo -->
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="company-logo" height="100" width="100">
        </div>

        <div class="text-right">
          <p>
            ${APP_TITLE}
          </p>
          <p class="text-gray-500 text-sm">
            ${SHMS_EMAIL}
          </p>
          <p class="text-gray-500 text-sm mt-1">
            ${SHMS_PHONE}
          </p>
        </div>
      </div>

      <!-- Client info -->
      <div class="grid grid-cols-2 items-center mt-8">
        <div>
          <p class="font-bold text-gray-800">
            عقد الاستثمار:
          </p>
          <p class="text-gray-500">
            ${investorName}
          </p>
          <p class="text-gray-500">
            ${projectName}
          </p>
        </div>

        <div class="text-right">
          <p class="">
            رقم العقد
            <span class="text-gray-500">INV-2023786123</span>
          </p>
          <p>
            تاريخ الإنشاء: <span class="text-gray-500">03/07/2023</span>
          </p>
        </div>
      </div>

      <!-- Invoice Items -->
      <div class="-mx-4 mt-8 flow-root sm:mx-0">
        <table class="min-w-full">
          <!-- Table Headers -->
          <colgroup>
            <col class="w-full sm:w-1/2">
            <col class="sm:w-1/6">
            <col class="sm:w-1/6">
            <col class="sm:w-1/6">
          </colgroup>
          <thead class="border-b border-gray-300 text-gray-900">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Items</th>
              <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">Quantity</th>
              <th scope="col" class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">Price</th>
              <th scope="col" class="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">Amount</th>
            </tr>
          </thead>
          <tbody>
            <!-- Invoice Items -->
            <tr class="border-b border-gray-200">
              <td class="max-w-0 py-5 pl-4 pr-3 text-sm leading-10 sm:pl-0">
                <p class="text-gray-900">
                هذا العقد يشهد على شراء عدد ${stocksPurchased} من أسهم مشروع ${projectName}
                </p>
                <p class="text-gray-500">
                  تم شراء الأسهم بمبلغ ${totalAmount} ريال قطري فقط، وتم ذلك في تاريخ ${arabicDate(
    new Date().toLocaleDateString()
  )}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <!-- Footer -->
            <tr>
              <th scope="row" class="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">المبلغ الإجمالي</th>
              <td class="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0" data-price>${totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Footer -->
      <div class="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
        <p className='pb-6 text-center text-gray-400 select-none'>
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
  totalAmount
}: generatePDFProps): Promise<Buffer> {
  const htmlContent = generatePDFContent(
    investorName,
    projectName,
    stocksPurchased,
    totalAmount
  )

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(htmlContent)

  // Generate PDF buffer
  const pdfBuffer = await page.pdf({ format: 'A4' })

  await browser.close()

  return pdfBuffer
}
