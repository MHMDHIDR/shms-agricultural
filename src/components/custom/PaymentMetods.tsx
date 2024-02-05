'use client'

import { useState } from 'react'
export default function PaymentMetods() {
  const [selectedOption, setSelectedOption] = useState('')

  const handleOptionChange = (event: { target: { value: any } }) => {
    setSelectedOption(event.target.value)
  }

  return (
    <div dir='rtl'>
      <label>
        <input
          type='radio'
          value='option1'
          checked={selectedOption === 'option1'}
          onChange={handleOptionChange}
          disabled
        />
        فيزا
      </label>
      <br />
      <label>
        <input
          type='radio'
          value='option2'
          checked={selectedOption === 'option2'}
          onChange={handleOptionChange}
          disabled
        />
        بطاقة ائتمان
      </label>
      <br />
      <label>
        <input
          type='radio'
          value='option3'
          checked={selectedOption === 'option3'}
          onChange={handleOptionChange}
        />
        نقدا
      </label>

      {/* Add more options as needed */}
    </div>
  )
}
