'use client'

import { cn } from '@/libs/utils'
import { useTheme } from 'next-themes'

export function ModeToggle({ className }: { className?: string }) {
  const localStorageTheme = localStorage.getItem('theme')
  const { setTheme, theme } = useTheme()

  return (
    <div
      className={cn(`scale-[.35] -mr-10 lg:ml-10 overflow-hidden`, className)}
      aria-controls='checkbox'
      aria-label={`Toggle theme`}
      title={`حول الثيم`}
      role='button'
    >
      <label htmlFor='toggleTheme'>
        <input
          id='toggleTheme'
          checked={(localStorageTheme ?? theme) === 'dark'}
          type='checkbox'
          className='hidden'
          onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
        <div className='toggle'>
          <div className='cloud'></div>
          <div className='star'></div>
          <div className='sea'></div>
          <div className='mountains'></div>
        </div>
      </label>
    </div>
  )
}
