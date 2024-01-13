'use client'

import { useTheme } from 'next-themes'

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme()

  return (
    <div
      className={`scale-[.35] overflow-hidden${className ? ` ${className}` : ''}`}
      aria-controls='checkbox'
      aria-label={`Toggle theme to ${theme === 'dark' ? 'light' : 'dark'}`}
      title={`حول الثيم الى ثيــم ${theme === 'dark' ? 'فاتح' : 'داكن'}`}
      role='button'
    >
      <label htmlFor='toggleTheme'>
        <input
          id='toggleTheme'
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
