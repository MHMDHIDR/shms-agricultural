'use client'

import { useState, useRef, useEffect } from 'react'

export default function Counter({ number }: { number: number }) {
  const [count, setCount] = useState(1)
  const counterRef = useRef(null)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true)

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
      { threshold: 0.7 }
    )

    const currentRef = counterRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [number, hasBeenVisible])

  return <span ref={counterRef}>{count}</span>
}
