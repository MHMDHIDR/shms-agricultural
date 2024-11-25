'use client'

import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon
} from '@/components/icons/socials'
import { API_URL } from '@/data/constants'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Success, Error } from '@/components/icons/status'
import { ReloadIcon } from '@radix-ui/react-icons'
import DashboardNav from '../dashboard-nav'
import Layout from '@/components/custom/layout'
import NotFound from '@/app/not-found'
import { LoadingPage } from '@/components/custom/loading'
import { getAuth } from '@/libs/actions/auth'
import type { UserLoggedInProps } from '@/types'
import type { Users, SocialLinks } from '@prisma/client'
import Link from 'next/link'

export default function SocialLinksPage() {
  const { data: session }: { data: UserLoggedInProps } = useSession()

  const [socialLinks, setSocialLinks] = useState<SocialLinks[]>([])
  const [selectedType, setSelectedType] = useState<
    SocialLinks['shms_social_type'] | null
  >(null)
  const [socialLink, setSocialLink] = useState<string>('')
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })
  const [userType, setUserType] = useState<Users['shms_user_account_type']>('user')
  const [loading, setLoading] = useState(true)

  const socialTypes: SocialLinks['shms_social_type'][] = [
    'facebook',
    'x',
    'instagram',
    'youtube'
  ]

  const fetchSocialLinks = async () => {
    try {
      const response = await axios.get(`${API_URL}/socialLinks`)
      setSocialLinks(response.data)
    } catch (error) {
      console.error('Error fetching social links:', error)
    }
  }

  useEffect(() => {
    const getUserData = async () => {
      const { userType, loading } = await getAuth()
      setUserType(userType)
      setLoading(loading)

      if (!loading) fetchSocialLinks()
    }

    getUserData()
  }, [session])

  const handleSubmitSocialLink = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedType || !socialLink) {
      toast('الرجاء اختيار النوع وإدخال الرابط', {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl'
      })
      return
    }

    try {
      setFormStatus({ ...formStatus, isSubmitting: true })

      const { data }: { data: SocialLinks } = await axios.post(`${API_URL}/socialLinks`, {
        shms_social_type: selectedType,
        shms_social_link: socialLink
      })

      if (data) {
        toast('تم إضافة الرابط بنجاح', {
          icon: <Success />,
          position: 'bottom-center',
          className: 'text-right select-none rtl'
        })
      }

      // Refresh social links
      fetchSocialLinks()

      // Reset form
      setSelectedType(null)
      setSocialLink('')
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ?? 'حدث خطأ ما'
      toast(errorMessage, {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl'
      })
      console.error('Error: ', errorMessage)
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
    }
  }

  const handleDeleteSocialLink = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/socialLinks/${id}`)

      toast('تم حذف الرابط بنجاح', {
        icon: <Success />,
        position: 'bottom-center',
        className: 'text-right select-none rtl pl-2',
        duration: 3000
      })

      fetchSocialLinks()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ?? 'حدث خطأ ما أثناء الحذف'
      toast(errorMessage, {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl'
      })
    }
  }

  return loading ? (
    <LoadingPage />
  ) : !session && userType === 'user' ? (
    <NotFound />
  ) : (
    <Layout>
      <h1 className='mt-20 mb-10 text-2xl font-bold text-center'>
        روابط التواصل الاجتماعي
      </h1>
      <DashboardNav />

      <section className='container mx-auto'>
        <CardWrapper heading='' className='max-w-full md:w-full'>
          <form dir='rtl' onSubmit={handleSubmitSocialLink}>
            <div className='flex items-center justify-center'>
              <div className='md:w-2/3'>
                {/* Social Type Selection */}
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      نوع المنصة
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <Select
                      dir='rtl'
                      value={selectedType ?? undefined}
                      onValueChange={(type: SocialLinks['shms_social_type']) =>
                        setSelectedType(type)
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='اختر المنصة' />
                      </SelectTrigger>
                      <SelectContent>
                        {socialTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            <span className='flex gap-x-2 items-center'>
                              {type === 'facebook' ? (
                                <FacebookIcon className='w-4 h-4 rounded-md' />
                              ) : type === 'instagram' ? (
                                <InstagramIcon className='w-4 h-4 rounded-md' />
                              ) : type === 'youtube' ? (
                                <YouTubeIcon className='w-4 h-4 rounded-md' />
                              ) : (
                                <TwitterIcon className='w-4 h-4 rounded-md' />
                              )}
                              {type}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Social Link Input */}
                <div className='mb-6 md:flex md:items-center'>
                  <div className='md:w-1/3'>
                    <label className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                      رابط المنصة
                    </label>
                  </div>
                  <div className='md:w-2/3'>
                    <input
                      className='w-full px-4 py-2 text-lg leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                      type='text'
                      placeholder='ادخل رابط المنصة'
                      value={socialLink}
                      onChange={e => setSocialLink(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className='mb-6 md:flex md:items-center'>
                  <Button
                    type='submit'
                    disabled={formStatus.isSubmitting || !selectedType || !socialLink}
                  >
                    {formStatus.isSubmitting ? (
                      <>
                        <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                        جاري الحفظ ...
                      </>
                    ) : (
                      'حفظ'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Social Links Table */}
          <Table className='table min-w-full min-h-full mt-0 text-center divide-y divide-gray-200 rtl'>
            <TableHeader>
              <TableRow>
                <TableHead className='font-bold text-center select-none'>
                  نوع المنصة
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  الرابط
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className='text-center text-gray-500'>
                    لا توجد روابط تواصل اجتماعي
                  </TableCell>
                </TableRow>
              ) : (
                socialLinks.map(link => (
                  <TableRow key={link.id}>
                    <TableCell className='flex gap-x-2 capitalize font-semibold'>
                      {link.shms_social_type === 'facebook' ? (
                        <FacebookIcon className='w-5 h-5 md:w-6 md:h-6' />
                      ) : link.shms_social_type === 'instagram' ? (
                        <InstagramIcon className='w-5 h-5 md:w-6 md:h-6' />
                      ) : link.shms_social_type === 'youtube' ? (
                        <YouTubeIcon className='w-5 h-5 md:w-6 md:h-6' />
                      ) : (
                        <TwitterIcon className='w-5 h-5 md:w-6 md:h-6' />
                      )}
                      {link.shms_social_type}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={link.shms_social_link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:underline font-bold'
                      >
                        {link.shms_social_link}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteSocialLink(link.id)}
                      >
                        حذف
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardWrapper>
      </section>
    </Layout>
  )
}
