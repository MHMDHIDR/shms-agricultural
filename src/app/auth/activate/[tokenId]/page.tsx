'use client'

import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { ReloadIcon } from '@radix-ui/react-icons'
import { API_URL } from '@/data/constants'
import { Error, Success } from '@/components/icons/Status'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { cn, validateUUID } from '@/lib/utils'
import { Info } from 'lucide-react'
import type { UserLoggedInProps, UserProps } from '@/types'
import { LoadingPage } from '@/components/custom/Loading'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ActivateAccount({
  params: { tokenId }
}: {
  params: { tokenId: string }
}) {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const { replace } = useRouter()

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isAccountActivated, setIsAccountActivated] = useState(false)

  const handleActivateAccount = async (e: { preventDefault: () => void }) => {
    // don't refresh the page
    e.preventDefault()

    try {
      setIsSubmittingForm(true)
      const activateUser: { data: UserProps } = await axios.put(
        API_URL + `/users/activate`,
        { userId: tokenId }
      )
      const { userActivated } = activateUser.data

      setIsAccountActivated(userActivated ? true : false)

      userActivated === 1 &&
        toast('مبروك تم تفعيل حسابك في شمس للخدمات الزراعية بنجاح 🎉', {
          icon: <Success className='inline-block' />,
          position: 'bottom-center',
          className: 'text-center rtl select-none',
          style: {
            backgroundColor: '#F0FAF0',
            color: '#367E18',
            border: '1px solid #367E18',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
    } catch (error) {
      console.error(error)
      toast('حدث خطأ ما، يرجى المحاولة مرة أخرى', {
        icon: <Error />,
        position: 'bottom-center',
        className: 'text-center rtl',
        style: {
          backgroundColor: '#FFF0F0',
          color: '#BE2A2A',
          border: '1px solid #BE2A2A',
          gap: '1.5rem',
          textAlign: 'justify'
        }
      })
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const HEADING = (
    <p className='flex flex-wrap items-center justify-center max-w-lg leading-loose text-center select-none gap-x-3 rtl'>
      {isAccountActivated ? (
        <>
          <Success className='w-16 h-16' />
          تم تفعيل حسابك بنجاح يمكنك الآن تسجيل الدخول للمتابعة في تصفح الموقع 👍🏼
        </>
      ) : (
        <>
          <Info className='text-blue-400' />
          تفعيل حسابك في شمس للخدمات الزراعية
        </>
      )}
    </p>
  )

  return session?.expires || session?.user ? (
    replace('/')
  ) : session?.user ? (
    <LoadingPage />
  ) : !validateUUID(tokenId) ? null : (
    <section className='mt-48 md:mt-32'>
      <CardWrapper
        heading={HEADING}
        headerLabel='لتفعيل الحساب الرجاء الضغط على الزر أدناه'
        backButtonLabel='لست مشترك؟ سجل الان'
        backButtonHref='/auth/signup'
        className='md:w-[50rem]'
      >
        <div className='flex items-center justify-center'>
          <form onSubmit={handleActivateAccount}>
            {!isAccountActivated ? (
              <Button
                type='submit'
                disabled={isAccountActivated}
                className={cn(
                  `rtl shadow mt-14 w-96 min-w-56 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold`,
                  (isAccountActivated || isSubmittingForm) &&
                    'cursor-not-allowed opacity-30 pointer-events-none'
                )}
              >
                {isSubmittingForm ? (
                  <>
                    <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                    جاري تفعيل الحساب ...
                  </>
                ) : (
                  'تفعيل الحساب'
                )}
              </Button>
            ) : (
              <Button
                asChild
                className='font-bold text-white bg-purple-500 shadow mt-14 w-96 min-w-56 hover:bg-purple-400 focus:shadow-outline focus:outline-none'
              >
                <Link href='/auth/signin'>تسجيل الدخــــول</Link>
              </Button>
            )}
          </form>
        </div>
      </CardWrapper>
    </section>
  )
}
