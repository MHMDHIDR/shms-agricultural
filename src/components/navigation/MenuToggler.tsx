'use cleint'

import { cn } from '@/lib/utils'

export function MenuToggler({
  setIsOpen,
  isOpen,
  position = 'left'
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
  position?: string
}) {
  return (
    <>
      {/* Nav toggler */}
      <input
        className={cn(
          `absolute left-0 top-6 md:pointer-events-none opacity-0 cursor-pointer w-10 h-10 z-20`,
          position
        )}
        type='checkbox'
        aria-label='Navigation Menu'
        title='Navigation Menu'
        id='menuToggler'
        onChange={() => setIsOpen(prev => !prev)}
      />
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className={cn(
          `absolute left-0 top-6 w-10 h-10 md:hidden transition-colors stroke-gray-800 dark:stroke-white z-10`,
          position
        )}
        viewBox='0 0 24 24'
      >
        <path
          className={`${
            isOpen ? 'rotate-45' : 'rotate-0'
          } origin-left transition-transform ease-in-out duration-300 stroke-green-600`}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1'
          d='M4 6h16M4'
        />
        <path
          className={`${
            isOpen ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
          } transition ease-in-out duration-300 stroke-green-600`}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1'
          d='M4 12h16M4'
        />
        <path
          className={`${
            isOpen ? '-rotate-45 -translate-x-1' : 'rotate-0'
          } origin-center transition-transform ease-in-out duration-300 stroke-green-600`}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1'
          d='M4 18h16'
        />
      </svg>
    </>
  )
}
