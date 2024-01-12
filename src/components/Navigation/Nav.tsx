import Link from 'next/link'
import { UserButton, auth } from '@clerk/nextjs'
import { ShoppingBag, Sun } from 'lucide-react'
import { Button } from '../ui/button'
import { ModeToggle } from './ModeToggle'

export default function Nav() {
  const { userId } = auth()

  return (
    <header className='bg-background text-foreground p-6'>
      <nav className='max-w-6xl py-6 m-auto'>
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
              <Button size={'icon'} variant='outline'>
                <ShoppingBag strokeWidth={'1.5px'} className='text-foreground text-lg ' />
              </Button>
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
                <Link href='profile' className='mr-4'>
                  حسابي
                </Link>
              )}
              <div className='ml-auto'>
                <UserButton afterSignOutUrl='/' />
              </div>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  )
}
