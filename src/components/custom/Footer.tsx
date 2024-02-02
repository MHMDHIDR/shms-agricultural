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
    // simple black background footer with soccial media links
    <footer className='border-t w-screen mt-20'>
      <section className='flex items-center justify-center w-full h-24 border-t rtl gap-x-20'>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://facebook.com'
          target='_blank'
        >
          <FacebookIcon />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://instagram.com/shmsagri'
          target='_blank'
        >
          <InstagramIcon />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://youtube.com'
          target='_blank'
        >
          <YouTubeIcon />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://twitter.com'
          target='_blank'
        >
          <TwitterIcon />
        </Link>
      </section>
      <p className='text-gray-400 text-center'>
        <span>&copy; {new Date().getFullYear()} </span>
        <span>{APP_TITLE}</span>
      </p>
    </footer>
  )
}
