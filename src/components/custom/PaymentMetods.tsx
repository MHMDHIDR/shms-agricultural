'use client'

import { useState } from 'react'
import { MyTooltip } from '@/components/ui/tooltip'
import { selectedPaymentOptions } from '@/types'

export default function PaymentMetods() {
  const [selectedOption, setSelectedOption] = useState<selectedPaymentOptions>('cash')

  const handleOptionChange = (event: { target: { value: any } }) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div className='flex flex-col rtl gap-y-2'>
      {/* فيزا   -- Visa */}
      <MyTooltip text='غير متاح حاليا'>
        <label className='opacity-50 cursor-not-allowed'>
          <input
            type='radio'
            value='visa'
            checked={selectedOption === 'visa'}
            onChange={handleOptionChange}
            disabled
          />
          <span className='mr-4'>
            <strong>فيزا</strong>
            <small className='mr-2'>(غير متاح حاليا)</small>
          </span>
        </label>
      </MyTooltip>
      {/* بطاقة ائتمانية   -- Credit Card */}
      <MyTooltip text='غير متاح حاليا'>
        <label className='opacity-50 cursor-not-allowed'>
          <input
            type='radio'
            value='credit'
            checked={selectedOption === 'credit'}
            onChange={handleOptionChange}
            disabled
          />
          <span className='mr-4'>
            <strong>بطاقة ائتمانية</strong>
            <small className='mr-2'>(غير متاح حاليا)</small>
          </span>
        </label>
      </MyTooltip>
      {/* نقدا   -- Cash */}
      <label className='cursor-pointer'>
        <input
          type='radio'
          value='cash'
          checked={selectedOption === 'cash'}
          onChange={handleOptionChange}
        />
        <span className='mr-4'>
          <strong>نقدا</strong>
        </span>
      </label>
      {/* رصيدي في شمس   -- Balance */}
      <label className='cursor-pointer'>
        <input
          type='radio'
          value='balance'
          checked={selectedOption === 'balance'}
          onChange={handleOptionChange}
        />
        <span className='mr-4'>
          <strong>الخصم من رصيد شمس</strong>
        </span>
      </label>
    </div>
  )
}
