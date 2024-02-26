'use client'

import { useState, useEffect, useRef } from 'react'

export default function Counter({ number }: { number: number }) {
  const [count, setCount] = useState(1)
  const counterRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
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
        }
      },
      // 0.5 تعني انه عندما يكون العنصر مرئي بنسبة 50% فقط
      { threshold: 0.5 }
    )

    observer.observe(counterRef?.current!)

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [number])

  return <span ref={counterRef}>{count}</span>
}
