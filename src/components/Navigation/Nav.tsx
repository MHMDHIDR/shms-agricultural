import Link from 'next/link'
import { UserButton, auth } from '@clerk/nextjs'
import { Sun } from 'lucide-react'
import { ModeToggle } from './ModeToggle'

export default function Nav() {
  const { userId } = auth()

  return (
    <header className='bg-background text-foreground p-6'>
      <nav className='max-w-6xl pb-6 m-auto'>
        <ul className='flex justify-between items-center'>
          <li>
            <Link className='font-bold' href={'/'}>
              <Sun className='text-[#FDB813]' />
            </Link>
          </li>
          <div className='flex items-center gap-8'>
            <li>
              <ModeToggle />
            </li>
            <li>
              {!userId && (
                <>
                  <Link href='signup' className='inline-block mr-3'>
                    انشاء حساب
                  </Link>
                  <Link href='signin' className='inline-block'>
                    تسجيل الدخول
                  </Link>
                </>
              )}

              {userId && (
                <Link href='profile'>
                  <UserButton afterSignOutUrl='/' />
                </Link>
              )}
            </li>
          </div>
        </ul>
      </nav>
    </header>
  )
}
