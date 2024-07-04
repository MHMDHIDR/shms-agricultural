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
      <section className='flex items-center justify-center w-full h-12 rtl gap-x-20'>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://facebook.com'
          target='_blank'
          aria-label='صفحتنا على الفيسبوك'
        >
          <FacebookIcon className='w-5 h-5 md:w-6 md:h-6' />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://instagram.com/shmsagri'
          target='_blank'
          aria-label='صفحتنا على الانستغرام'
        >
          <InstagramIcon className='w-5 h-5 md:w-6 md:h-6' />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://youtube.com'
          target='_blank'
          aria-label='قناتنا على اليوتيوب'
        >
          <YouTubeIcon className='w-5 h-5 md:w-6 md:h-6' />
        </Link>
        <Link
          className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
          href='https://twitter.com'
          target='_blank'
          aria-label='حسابنا على تويتر'
        >
          <TwitterIcon className='w-5 h-5 md:w-6 md:h-6' />
        </Link>
      </section>
      <section className='flex items-center justify-center w-full h-12 text-sm rtl gap-x-3'>
        <Link
          href='/privacy'
          className='opacity-60 hover:opacity-90 transition'
          aria-label='سياسة الخصوصية'
        >
          سياسة الخصوصية
        </Link>
        <span className='select-none opacity-60'>|</span>
        <Link
          href='/terms'
          className='opacity-60 hover:opacity-90 transition'
          aria-label='شروط الاستخدام'
        >
          شروط الاستخدام
        </Link>
      </section>
      <p className='pb-6 text-center text-gray-400 select-none'>
        <span>&copy; {new Date().getFullYear()} </span>
        <span>{APP_TITLE}</span>
      </p>
    </footer>
  )
}
