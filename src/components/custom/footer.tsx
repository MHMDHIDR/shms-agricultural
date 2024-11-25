'use client'

import Divider from '@/components/custom/divider'
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon
} from '@/components/icons/socials'
import { API_URL, APP_TITLE } from '@/data/constants'
import { SocialLinks } from '@prisma/client'
import axios, { AxiosResponse } from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks[]>([])

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response: AxiosResponse<any, SocialLinks> = await axios.get(
          `${API_URL}/socialLinks`
        )
        setSocialLinks(response.data)
      } catch (error) {
        console.error('Error fetching social links:', error)
      }
    }
    fetchSocialLinks()
  }, [])

  return (
    <footer className='w-screen mt-20'>
      <Divider />
      <section className='flex items-center justify-center w-full h-12 rtl gap-x-20'>
        {socialLinks.map(link => (
          <Link
            key={link.id}
            href={link.shms_social_link}
            target='_blank'
            className='opacity-60 hover:opacity-90 hover:-translate-y-1 transition'
            aria-label={`صفحتنا على ${link.shms_social_type}`}
          >
            {link.shms_social_type === 'facebook' ? (
              <FacebookIcon className='w-5 h-5 md:w-6 md:h-6' />
            ) : link.shms_social_type === 'instagram' ? (
              <InstagramIcon className='w-5 h-5 md:w-6 md:h-6' />
            ) : link.shms_social_type === 'youtube' ? (
              <YouTubeIcon className='w-5 h-5 md:w-6 md:h-6' />
            ) : (
              <TwitterIcon className='w-5 h-5 md:w-6 md:h-6' />
            )}
          </Link>
        ))}
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
