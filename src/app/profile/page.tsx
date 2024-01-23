'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Info } from 'lucide-react'
import { UserLoggedInProps } from '@/types'

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

export default function ProfilePage() {
  const { data: session }: { data: UserLoggedInProps } = useSession()

  const HEADING = (
    <p className='flex text-center max-w-lg items-center justify-center rtl'>
      <Info className='w-16 h-16 text-blue-300' />
      مرحبا بك في مشاريع شمس للخدمات الزراعية
    </p>
  )

  return (
    <section>
      <CardWrapper
        heading={HEADING}
        backButtonLabel='الذهاب للصفحة الرئيسية'
        backButtonHref='/'
        className='md:w-[50rem] mt-[15rem] mx-auto'
      >
        <div className='flex flex-col items-center justify-center'>
          <div>
            <span className='text-center inline-block w-full mb-10'>
              {session?.token?.user.fullname ?? ''}
            </span>
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

          <div dir='rtl' style={{ margin: 20 }} className='md:flex md:items-center mb-6'>
            <Tabs dir='rtl' defaultValue='account' className='w-[400px]'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='account'>الحساب</TabsTrigger>
                <TabsTrigger value='password'>كلمة المرور</TabsTrigger>
              </TabsList>
              <TabsContent value='account'>
                <Card>
                  <CardHeader>
                    <CardTitle dir='rtl'>
                      الاسم : {session?.token?.user.fullname ?? ''}{' '}
                    </CardTitle>
                    <CardDescription dir='rtl'>تحديث البيانات الشخصية</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <div dir='rtl' className='space-y-1'>
                      <Label htmlFor='name'> البريد الالكتروني </Label>
                      <Input
                        id='name'
                        defaultValue={session?.token?.user.shms_email ?? ''}
                      />
                    </div>
                  </CardContent>
                  <div>
                    <CardTitle dir='rtl'>تغيير الى الوضع الداكن</CardTitle>
                    <ModeToggle />
                  </div>
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
                      <Label htmlFor='new'> كلمة المرور الجديدة </Label>
                      <Input id='new' type='password' />
                    </div>
                    <div className='space-y-1'>
                      <Label htmlFor='new'> تأكيد كلمة المرور </Label>
                      <Input id='new' type='password' />
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
