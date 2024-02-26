'use client'

import { useState, useEffect } from 'react'

export default function Counter({ number }: { number: number }) {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const animationDuration = 2000
    const step = Math.ceil(number / (animationDuration / 100))
    let currentCount = 1

    const interval = setInterval(() => {
      currentCount += step
      if (currentCount >= number) {
        clearInterval(interval)
        currentCount = number
      }
      setCount(currentCount)
    }, 100)

    return () => clearInterval(interval)
  }, [number])

  return <>{count}</>
}
