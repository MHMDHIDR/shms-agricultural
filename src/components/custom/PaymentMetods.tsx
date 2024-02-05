'use client'

import { useState } from 'react'
export default function PaymentMetods() {
  const [selectedOption, setSelectedOption] = useState('')

  const handleOptionChange = (event: { target: { value: any } }) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div dir='rtl'>
      {/* فيزا   -- Visa */}
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
      <br />
      {/* بطاقة ائتمانية   -- Credit Card */}
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
      <br />
      {/* نقدا   -- Cash */}
      <label>
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
