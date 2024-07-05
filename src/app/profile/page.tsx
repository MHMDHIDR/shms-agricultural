'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Error, Success } from '@/components/icons/Status'
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
import { ModeToggle } from '@/components/navigation/mode-toggle'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { validatePasswordStrength, validateEmail, handleSignOut } from '@/libs/utils'
import { toast } from 'sonner'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import axios from 'axios'
import { ReloadIcon } from '@radix-ui/react-icons'
import FormMessage from '@/components/custom/form-message'
import Layout from '@/components/custom/layout'
import { getAuth } from '@/libs/actions/auth'
import NotFound from '@/app/not-found'
import { Users } from '@prisma/client'
import type { UserLoggedInProps, getAuthType } from '@/types'

export default function ProfilePage() {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const { theme } = useTheme()

  const [fullname, setFullname] = useState('')
  const [currentEmail, setCurrentEmail] = useState('')
  const [localUser, setLocalUser] = useState<getAuthType>()

  useEffect(() => {
    setCurrentEmail(session?.token?.user.shms_email ?? '')

    const getUserData = async () => {
      const { userName, loading } = await getAuth()
      if (loading) return

      setFullname(userName ?? session?.token?.user.shms_fullname ?? '')
    }

    getUserData()

    // Load user using localStorage.getItem('shms_user_data')
    const storedEmail = JSON.parse(localStorage.getItem('shms_user_data') ?? '{}')
    if (storedEmail) {
      setLocalUser(storedEmail as unknown as getAuthType) // Fix: Explicitly cast the stored email to the expected type
    } else {
      setLocalUser(session?.token?.user.shms_email as unknown as getAuthType) // Fix: Explicitly cast the email to the expected type
    }
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
        const { data }: { data: Users } = resetPass

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
      } catch (error: any) {
        //handle error, show notification using Shadcn notifcation
        toast(error.response.data.message, {
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

    if (email === '' && email === currentEmail) {
      setEmailError('الرجاء إدخال بريد الكتروني جديد')
      return
    } else if (!validateEmail(email) && email === currentEmail) {
      setEmailError('الرجاء إدخال بريد الكتروني صحيح')
      return
    } else if (validateEmail(email) && email !== currentEmail) {
      try {
        resetFormErrors()
        setIsSubmittingEmailForm(true)

        const resetPass = await axios.patch(`${API_URL}/users/resetemail`, {
          userEmail: email,
          oldEmail: currentEmail,
          fullname
        })
        //getting response from backend
        const { data }: { data: Users } = resetPass

        // make sure to view the response from the data
        if (data.resetEmail === 1) {
          toast(data.message, {
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

          setTimeout(async () => {
            await handleSignOut()
          }, DEFAULT_DURATION - DEFAULT_DURATION * 0.2)
        }
      } catch (error: any) {
        //handle error, show notification using Shadcn notifcation
        toast(error.response.data.message, {
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
      }
    }
  }

  return !session ? (
    <NotFound />
  ) : (
    <Layout>
      <CardWrapper
        heading={''}
        backButtonLabel='الذهاب للصفحة الرئيسية'
        backButtonHref='/'
        className='md:w-[50rem] mt-16 mx-auto'
      >
        <div className='flex flex-col items-center justify-center'>
          <Button
            asChild
            className='font-bold text-white bg-purple-500 shadow w-96 min-w-56 hover:bg-purple-400 focus:shadow-outline focus:outline-none'
          >
            <Link href='/profile/investments'>الذهاب إلـــى لوحة التحكم</Link>
          </Button>

          <div dir='rtl' className='my-6 md:flex md:items-center md:my-10'>
            <Tabs dir='rtl' defaultValue='account' className='w-[400px]'>
              <TabsList className='w-full grid grid-cols-2'>
                <TabsTrigger value='account'>الحساب</TabsTrigger>
                <TabsTrigger value='password'>كلمة المرور</TabsTrigger>
              </TabsList>
              <TabsContent value='account'>
                <Card>
                  <form onSubmit={handleRenewEmail}>
                    <CardHeader>
                      <CardTitle dir='rtl'>
                        الاسم : {localUser?.userName ?? fullname}
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
                          defaultValue={localUser?.userEmail ?? currentEmail}
                        />
                      </div>
                    </CardContent>
                    <CardContent className='-space-y-4'>
                      <Label>
                        تغيير الى الوضع {theme === 'dark' ? 'الفاتح' : 'الداكن'}
                      </Label>
                      <ModeToggle className='-mr-16 max-w-fit' />
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`font-bold disabled:pointer-events-auto ${
                          isSubmittingEmailForm
                            ? 'cursor-progress'
                            : 'disabled:cursor-not-allowed'
                        }`}
                        disabled={!email || isSubmittingEmailForm}
                      >
                        {isSubmittingEmailForm ? (
                          <>
                            <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
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
                        className={`font-bold ${
                          isSubmittingPasswordForm ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                        disabled={isSubmittingPasswordForm}
                      >
                        {isSubmittingPasswordForm ? (
                          <>
                            <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
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
