'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Sun } from 'lucide-react'
import { ModeToggle } from './ModeToggle'

export default function Nav() {
  const { userId } = useAuth()

  const components: { title: string; href: string; description: string }[] = [
    {
      title: 'Alert Dialog',
      href: '/docs/primitives/alert-dialog',
      description:
        'A modal dialog that interrupts the user with important content and expects a response.'
    },
    {
      title: 'Hover Card',
      href: '/docs/primitives/hover-card',
      description: 'For sighted users to preview content available behind a link.'
    },
    {
      title: 'Progress',
      href: '/docs/primitives/progress',
      description:
        'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.'
    },
    {
      title: 'Scroll-area',
      href: '/docs/primitives/scroll-area',
      description: 'Visually or semantically separates content.'
    },
    {
      title: 'Tabs',
      href: '/docs/primitives/tabs',
      description:
        'A set of layered sections of content—known as tab panels—that are displayed one at a time.'
    },
    {
      title: 'Tooltip',
      href: '/docs/primitives/tooltip',
      description:
        'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.'
    }
  ]

  return (
    <header className='bg-background text-foreground p-6'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link className='font-bold' href={'/'}>
              <Sun className='text-[#FDB813]' />
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                <li className='row-span-3'>
                  <NavigationMenuLink asChild>
                    <a
                      className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                      href='/'
                    >
                      IconHere
                      <div className='mb-2 mt-4 text-lg font-medium'>shadcn/ui</div>
                      <p className='text-sm leading-tight text-muted-foreground'>
                        Beautifully designed components built with Radix UI and Tailwind
                        CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href='/docs' title='Introduction'>
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href='/docs/installation' title='Installation'>
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href='/docs/primitives/typography' title='Typography'>
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
                <ListItem href={userId ? `/profile` : `/signin`} title='حسابي'>
                  {userId ? `حسابي` : `تسجيل الدخول`}
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                {components.map(component => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/docs' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ModeToggle className='flex' />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* <nav className='max-w-6xl pb-6 m-auto'>
        <ul className='flex justify-between items-center'>
          <li>
            <Link className='font-bold' href={'/'}>
              <Sun className='text-[#FDB813]' />
            </Link>
          </li>
          <div className='flex gap-8 items-center'>
            <li>
              <ModeToggle className='flex' />
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
      </nav> */}
    </header>
  )
}

const ListItem = forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'
