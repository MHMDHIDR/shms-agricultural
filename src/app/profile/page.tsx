'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Error, Success } from '@/components/icons/Status'
import type { UserLoggedInProps, UserProps } from '@/types'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModeToggle } from '@/components/navigation/ModeToggle'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { validatePasswordStrength, validateEmail } from '@/lib/utils'
import { toast } from 'sonner'
import { API_URL, APP_URL, DEFAULT_DURATION } from '@/data/constants'
import axios from 'axios'
import { ReloadIcon } from '@radix-ui/react-icons'
import FormMessage from '@/components/custom/FormMessage'
import { revalidatePath } from 'next/cache'
import Layout from '@/components/custom/Layout'
import { getAuth } from '@/lib/actions/auth'

export default function ProfilePage() {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const { theme } = useTheme()

  const [fullname, setFullname] = useState('')
  const [currentEmail, setCurrentEmail] = useState('')

  useEffect(() => {
    setCurrentEmail(session?.token?.user.shms_email ?? '')

    const getUserData = async () => {
      const { userName, loading } = await getAuth()
      if (loading) return

      setFullname(userName ?? session?.token?.user.fullname ?? '')
    }

    getUserData()
  }, [session])

  const [email, setEmail] = useState('')
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [comfirm_password, setComfirm_password] = useState('')

  const [emailError, setEmailError] = useState('')
  const [currentError, setCurrentError] = useState('')
  const [passError, setPassError] = useState('')
  const [comfirm_passwordError, setComfirm_passwordError] = useState('')

  const [isSubmittingPasswordForm, setIsSubmittingPasswordForm] = useState<boolean>(false)
  const [isSubmittingEmailForm, setIsSubmittingEmailForm] = useState<boolean>(false)

  const { replace } = useRouter()

  function resetFormErrors() {
    setCurrentError('')
    setPassError('')
    setComfirm_passwordError('')
  }

  const handleRenewPassowrd = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    if (current === '') {
      setCurrentError('الرجاء إدخال كلمة المرور الحالية')
      return
    } else if (password === '') {
      setPassError('الرجاء إدخال كلمة المرور الجديدة')
      return
    } else if (comfirm_password === '') {
      setComfirm_passwordError('الرجاء إدخال كلمة المرور الجديدة')
      return
    } else if (!validatePasswordStrength(current)) {
      setCurrentError(
        'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
      return
    } else if (!validatePasswordStrength(password)) {
      setPassError(
        'كلمة المرور الجديدة يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
      return
    } else if (!validatePasswordStrength(comfirm_password)) {
      setComfirm_passwordError(
        'تأكيد كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
      return
    } else if (password !== comfirm_password) {
      setComfirm_passwordError('كلمة المرور غير متطابقة')
      return
    } else {
      try {
        resetFormErrors()
        setIsSubmittingPasswordForm(true)

        const resetPass = await axios.post(`${API_URL}/users/resetpass`, {
          password,
          userOldPassword: current,
          userEmail: session?.token?.user.shms_email ?? '',
          isRenewingPassword: true
        })
        //getting response from backend
        const { data }: { data: UserProps } = resetPass

        // make sure to view the response from the data
        data.newPassSet === 1
          ? toast(data.message, {
              icon: <Success />,
              position: 'bottom-center',
              className: 'text-right select-none rtl',
              duration: DEFAULT_DURATION,
              style: {
                backgroundColor: '#F0FAF0',
                color: '#367E18',
                border: '1px solid #367E18',
                gap: '1.5rem',
                textAlign: 'justify'
              }
            })
          : toast(data.message ?? 'حدث خطأ ما، الرجاء المحاولة مرة أخرى', {
              icon: <Error />,
              position: 'bottom-center',
              className: 'text-right select-none rtl',
              duration: DEFAULT_DURATION,
              style: {
                backgroundColor: '#FFF0F0',
                color: '#BE2A2A',
                border: '1px solid #BE2A2A',
                gap: '1.5rem',
                textAlign: 'justify'
              }
            })

        revalidatePath('/', 'layout')

        setTimeout(() => replace(`/profile`), DEFAULT_DURATION / 2)
      } catch (error: any) {
        const message: UserProps['message'] =
          error?.response.data.message ?? 'عفواً! حدث خطأ غير متوقع حاول مرة أخرى'
        //handle error, show notification using Shadcn notifcation
        toast(message, {
          icon: <Error className='w-6 h-6 ml-3' />,
          position: 'bottom-center',
          className: 'text-right select-none rtl',
          style: {
            backgroundColor: '#FFF0F0',
            color: '#BE2A2A',
            border: '1px solid #BE2A2A',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
      } finally {
        setIsSubmittingPasswordForm(false)
      }
    }
  }

  const handleRenewEmail = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    if (email === '') {
      setEmailError('الرجاء إدخال بريد الكتروني جديد')
      return
    } else if (!validateEmail(email)) {
      setEmailError('الرجاء إدخال بريد الكتروني صحيح')
      return
    } else {
      try {
        resetFormErrors()
        setIsSubmittingEmailForm(true)

        const resetPass = await axios.put(`${API_URL}/users/resetemail`, {
          userEmail: email,
          oldEmail: currentEmail,
          fullname
        })
        //getting response from backend
        const { data }: { data: UserProps } = resetPass

        // make sure to view the response from the data
        data.resetEmail === 1
          ? toast(data.message, {
              icon: <Success />,
              position: 'bottom-center',
              className: 'text-right select-none rtl',
              duration: DEFAULT_DURATION,
              style: {
                backgroundColor: '#F0FAF0',
                color: '#367E18',
                border: '1px solid #367E18',
                gap: '1.5rem',
                textAlign: 'justify'
              }
            })
          : toast(data.message ?? 'حدث خطأ ما، الرجاء المحاولة مرة أخرى', {
              icon: <Error />,
              position: 'bottom-center',
              className: 'text-right select-none rtl',
              duration: DEFAULT_DURATION,
              style: {
                backgroundColor: '#FFF0F0',
                color: '#BE2A2A',
                border: '1px solid #BE2A2A',
                gap: '1.5rem',
                textAlign: 'justify'
              }
            })

        revalidatePath('/', 'layout')
        // تسجيل خروج المستخدم ضروري لتحديث البريد الالكتروني في الجلسة الحالية
        setTimeout(async () => {
          await signOut({ redirect: true, callbackUrl: APP_URL ?? '/' })
        }, DEFAULT_DURATION / 2)
      } catch (error: any) {
        const message: UserProps['message'] = error?.response
          ? error?.response.data.message
          : 'عفواً! حدث خطأ غير متوقع حاول مرة أخرى'
        //handle error, show notification using Shadcn notifcation
        toast(message, {
          icon: <Error className='w-6 h-6 ml-3' />,
          position: 'bottom-center',
          className: 'text-right select-none rtl',
          style: {
            backgroundColor: '#FFF0F0',
            color: '#BE2A2A',
            border: '1px solid #BE2A2A',
            gap: '1.5rem',
            textAlign: 'justify'
          }
        })
      } finally {
        setIsSubmittingEmailForm(false)
      }
    }
  }

  return (
    <Layout>
      <CardWrapper
        heading={''}
        backButtonLabel='الذهاب للصفحة الرئيسية'
        backButtonHref='/'
        className='md:w-[50rem] mt-[10rem] mx-auto'
      >
        <div className='flex flex-col items-center justify-center'>
          <Button
            asChild
            className='shadow w-96 min-w-56 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold'
          >
            <Link href='/projects'>الذهاب إلـــى المشاريع</Link>
          </Button>

          <div dir='rtl' className='md:flex md:items-center my-6 md:my-10'>
            <Tabs dir='rtl' defaultValue='account' className='w-[400px]'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='account'>الحساب</TabsTrigger>
                <TabsTrigger value='password'>كلمة المرور</TabsTrigger>
              </TabsList>
              <TabsContent value='account'>
                <Card>
                  <form onSubmit={handleRenewEmail}>
                    <CardHeader>
                      <CardTitle dir='rtl'>
                        الاسم : {session?.token?.user.fullname ?? ''}
                      </CardTitle>
                      <CardDescription dir='rtl'>تحديث البيانات الشخصية</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                      {emailError && <FormMessage error>{emailError}</FormMessage>}
                      <div dir='rtl' className='space-y-1'>
                        <Label htmlFor='email'>البريد الالكتروني</Label>
                        <Input
                          id='email'
                          onChange={e => setEmail(e.target.value)}
                          defaultValue={session?.token?.user.shms_email ?? ''}
                        />
                      </div>
                    </CardContent>
                    <CardContent className='-space-y-4'>
                      {/* suppressHydrationWarning is important to prevent server hydration warning */}
                      <Label suppressHydrationWarning>
                        تغيير الى الوضع {theme === 'dark' ? 'الفاتح' : 'الداكن'}
                      </Label>
                      <ModeToggle className='-mr-16 max-w-fit' />
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={isSubmittingEmailForm}
                        className={`font-bold ${
                          isSubmittingEmailForm ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                      >
                        {isSubmittingEmailForm ? (
                          <>
                            <ReloadIcon className='ml-3 h-4 w-4 animate-spin' />
                            جاري حفظ التغييرات
                          </>
                        ) : (
                          'حفظ التغييرات'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              <TabsContent value='password'>
                <Card>
                  <form onSubmit={handleRenewPassowrd}>
                    <CardHeader>
                      <CardTitle>كلمة المرور</CardTitle>
                      <CardDescription>
                        قم بتغيير كلمة المرور الخاصة بك هنا.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                      {currentError && <FormMessage error>{currentError}</FormMessage>}
                      <div className='space-y-1'>
                        <Label htmlFor='current'>كلمة المرور الحالية</Label>
                        <Input
                          id='current'
                          onChange={e => setCurrent(e.target.value)}
                          onBlur={e =>
                            !validatePasswordStrength(e.target.value)
                              ? setCurrentError(
                                  'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
                                )
                              : setCurrentError('')
                          }
                          type='password'
                        />
                      </div>
                      {passError && <FormMessage error>{passError}</FormMessage>}
                      <div className='space-y-1'>
                        <Label htmlFor='password'>كلمة المرور الجديدة</Label>
                        <Input
                          id='password'
                          onChange={e => setPassword(e.target.value)}
                          onBlur={e =>
                            !validatePasswordStrength(e.target.value)
                              ? setPassError(
                                  'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
                                )
                              : setPassError('')
                          }
                          type='password'
                        />
                      </div>
                      {comfirm_passwordError && (
                        <FormMessage error>{comfirm_passwordError}</FormMessage>
                      )}
                      <div className='space-y-1'>
                        <Label htmlFor='comfirm_password'>تأكيد كلمة المرور</Label>
                        <Input
                          id='comfirm_password'
                          onChange={e => setComfirm_password(e.target.value)}
                          onBlur={e =>
                            !validatePasswordStrength(e.target.value)
                              ? setComfirm_passwordError(
                                  'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
                                )
                              : setComfirm_passwordError('')
                          }
                          type='password'
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={isSubmittingPasswordForm}
                        className={`font-bold ${
                          isSubmittingPasswordForm ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                      >
                        {isSubmittingPasswordForm ? (
                          <>
                            <ReloadIcon className='ml-3 h-4 w-4 animate-spin' />
                            جاري حفظ التغييرات
                          </>
                        ) : (
                          'حفظ التغييرات'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardWrapper>
    </Layout>
  )
}
