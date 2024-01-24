'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Info } from 'lucide-react'
import type { UserLoggedInProps } from '@/types'

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

export default function ProfilePage() {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const { theme } = useTheme()

  const HEADING = (
    <div className='flex text-center max-w-lg items-center justify-center rtl leading-relaxed'>
      <Info className='w-16 h-16 text-blue-300 ml-2' />
      مرحبا بك في مشاريع
      <br />
      شمس للخدمات الزراعية
    </div>
  )

  return (
    <section>
      <CardWrapper
        heading={HEADING}
        backButtonLabel='الذهاب للصفحة الرئيسية'
        backButtonHref='/'
        className='md:w-[50rem] mt-[10rem] mx-auto'
      >
        <div className='flex flex-col items-center justify-center'>
          <div>
            <p className='text-center max-w-lg items-center justify-center rtl'>
              لا يوجد لديك مشاريع حالياً
            </p>
            <p className='text-center max-w-lg items-center justify-center rtl'>
              يمكنك الاستثمار في مشروع جديد من خلال الضغط على الزر أدناه
            </p>
          </div>

          <Button
            asChild
            className='shadow mt-14 w-96 min-w-56 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold'
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
                  <CardHeader>
                    <CardTitle dir='rtl'>
                      الاسم : {session?.token?.user.fullname ?? ''}
                    </CardTitle>
                    <CardDescription dir='rtl'>تحديث البيانات الشخصية</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div dir='rtl' className='space-y-1'>
                      <Label htmlFor='email'>البريد الالكتروني</Label>
                      <Input
                        id='email'
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
                    <Button>حفظ التغييرات</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value='password'>
                <Card>
                  <CardHeader>
                    <CardTitle>كلمة المرور</CardTitle>
                    <CardDescription>
                      قم بتغيير كلمة المرور الخاصة بك هنا.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div className='space-y-1'>
                      <Label htmlFor='current'>كلمة المرور الحالية</Label>
                      <Input id='current' type='password' />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='password'>كلمة المرور الجديدة</Label>
                      <Input id='password' type='password' />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='comfirm_password'>تأكيد كلمة المرور</Label>
                      <Input id='comfirm_password' type='password' />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button> حفظ التغييرات </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardWrapper>
    </section>
  )
}
