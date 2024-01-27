'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { API_URL, APP_LOGO, DEFAULT_DURATION } from '@/data/constants'
import type { UserProps } from '@/types'
import { arabicDate } from '@/lib/utils'
import Confirm from '@/components/custom/Confirm'
import Modal from '@/components/custom/Modal'
import { Error, Success } from '@/components/icons/Status'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function Users() {
  const [users, setUsers] = useState<UserProps[]>([])
  const [userDeleted, setUserDeleted] = useState<UserProps['userDeleted']>(0)

  const { refresh } = useRouter()

  useEffect(() => {
    const getUsers = async () => {
      const { data: users }: { data: UserProps[] } = await axios.get(
        `${API_URL}/users/all`
      )
      setUsers(users)
    }
    getUsers()
  }, [userDeleted])

  const deleteUser = async (id: string) => {
    try {
      const { data }: { data: UserProps } = await axios.delete(
        `${API_URL}/users/delete/${id}`
      )

      // make sure to view the response from the data
      data.userDeleted === 1 &&
        toast(data.message ?? 'تم حذف حساب المستخدم بنجاح 👍🏼', {
          icon: <Success className='w-6 h-6 ml-3' />,
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

      setUserDeleted(data.userDeleted ?? 0)

      setTimeout(() => refresh(), DEFAULT_DURATION)
    } catch (error) {
      //handle error, show notification using Shadcn notifcation
      toast(JSON.stringify(error ?? 'حدث خطأ ما'), {
        // message: old var
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
      console.error('Error', error)
    }
  }

  return (
    <TabsContent dir='rtl' value='users'>
      <div style={{ width: '100%', display: 'flex' }}>
        <Card className='min-w-full'>
          <CardHeader dir='rtl'>
            <CardTitle> المستخدمين </CardTitle>
            <CardDescription>{users.length ?? 0}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table className='min-w-full text-center divide-y divide-gray-200'>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>البريد الالكتروني</TableHead>
                  <TableHead>حالة المستخدم</TableHead>
                  <TableHead>عدد الاسهم</TableHead>
                  <TableHead>الاجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!users || users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='space-y-6'>
                      <Skeleton className='w-full h-12' />
                      <Skeleton className='w-full h-12' />
                      <Skeleton className='w-full h-12' />
                      <Skeleton className='w-full h-12' />
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user.shms_id}>
                      <TableCell className='min-w-40'>{user.shms_fullname}</TableCell>
                      <TableCell className='min-w-40'>
                        {arabicDate(user.shms_created_at ?? '')}
                      </TableCell>
                      <TableCell className='min-w-40'>{user.shms_phone}</TableCell>
                      <TableCell className='min-w-40'>{user.shms_email}</TableCell>
                      <TableCell className='min-w-40'>
                        {user.shms_user_account_status === 'active' ? 'نشط' : 'غير نشط'}
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {user.shms_user_stocks?.length ?? 'لم يتم شراء أسهم بعد'}
                      </TableCell>
                      <TableCell className='flex min-w-56 gap-x-2'>
                        <Confirm
                          className='font-bold bg-red-500 hover:bg-red-600 dark:text-white'
                          onClick={async () => await deleteUser(user.shms_id)}
                        >
                          حذف
                        </Confirm>
                        <Modal
                          title={`صورة المستند لــ ${user.shms_fullname}`}
                          document={user.shms_doc ?? APP_LOGO}
                          className='font-bold dark:text-white'
                        >
                          عرض المستند
                        </Modal>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
