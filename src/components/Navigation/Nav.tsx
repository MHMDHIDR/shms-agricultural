import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { ShoppingBag, Sun } from 'lucide-react'
import { Button } from '../ui/button'
import { ModeToggle } from './ModeToggle'

export default function Nav() {
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
              <UserButton afterSignOutUrl='/' />
            </li>
          </div>
        </ul>
      </nav>
    </header>
  )
}
