'use client'

import { Button } from '@/components/ui/button'
import { generatePDF } from '@/lib/pdfGenerator'
import type { generatePDFProps } from '@/types'

export default function _ShowInvestment({
  projectName,
  stocksPurchased,
  totalAmount,
  totalProfit,
  profitsCollectDate,
  referenceCode
}: generatePDFProps) {
  const handleGeneratePDF = async () => {
    const pdfData = {
      investorName: 'John Doe', // You can replace this with actual data if available
      projectName,
      stocksPurchased,
      totalAmount,
      totalProfit,
      profitsCollectDate,
      referenceCode
    }

    try {
      const pdfBuffer = await generatePDF(pdfData)
      const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' })
      const pdfUrl = URL.createObjectURL(pdfBlob)
      window.open(pdfUrl, '_blank')
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <Button variant={'pressable'} onClick={handleGeneratePDF}>
      عرض العقد
    </Button>
  )
}
