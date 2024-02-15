'use client'

import { useState } from 'react'
import { MyTooltip } from '@/components/ui/tooltip'

export default function PaymentMetods() {
  const [selectedOption, setSelectedOption] = useState('cash')

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
          <span className='mr-4'>فيزا</span>
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
          <span className='mr-4'>بطاقة ائتمان</span>
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
    </div>
  )
}
