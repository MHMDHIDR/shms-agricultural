import Divider from '@/components/custom/Divider'
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon
} from '@/components/icons/Socials'
import { APP_TITLE } from '@/data/constants'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='w-screen mt-20'>
      <Divider />
      <section className='flex items-center justify-center w-full h-24 rtl gap-x-20'>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://facebook.com'
          target='_blank'
        >
          <FacebookIcon className='w-5 h-5 md:w-6 md:h-6' />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://instagram.com/shmsagri'
          target='_blank'
        >
          <InstagramIcon className='w-5 h-5 md:w-6 md:h-6' />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://youtube.com'
          target='_blank'
        >
          <YouTubeIcon className='w-5 h-5 md:w-6 md:h-6' />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://twitter.com'
          target='_blank'
        >
          <TwitterIcon className='w-5 h-5 md:w-6 md:h-6' />
        </Link>
      </section>
      <p className='text-gray-400 text-center pb-6 select-none'>
        <span>&copy; {new Date().getFullYear()} </span>
        <span>{APP_TITLE}</span>
      </p>
    </footer>
  )
}
