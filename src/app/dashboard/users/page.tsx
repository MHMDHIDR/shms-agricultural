'use client'

import Confirm from '@/components/custom/Confirm'
import Modal from '@/components/custom/Modal'
import { Error, Success } from '@/components/icons/Status'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TabsContent } from '@/components/ui/tabs'
import { API_URL, APP_LOGO, DEFAULT_DURATION } from '@/data/constants'
import { arabicDate } from '@/lib/utils'
import type { UserProps } from '@/types'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Users() {
  const [users, setUsers] = useState<UserProps[]>([])
  const [userDeleted, setUserDeleted] = useState<UserProps['userDeleted']>(0)

  const { refresh } = useRouter()

  const getUsers = async () => {
    const { data: users }: { data: UserProps[] } = await axios.get(`${API_URL}/users/all`)
    setUsers(users)
  }

  useEffect(() => {
    getUsers()
  }, [userDeleted])

  const deleteUser = async (id: string, S3docId: string) => {
    try {
      const { data }: { data: UserProps } = await axios.delete(
        `${API_URL}/users/delete/${id}`
      )

      // delete user document from s3 bucket
      const {
        data: { docDeleted }
      }: { data: { docDeleted: boolean } } = await axios.delete(
        decodeURI(`${API_URL}/deleteFromS3/${S3docId}`)
      )

      // make sure to view the response from the data
      if (data.userDeleted === 1 && docDeleted) {
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
      } else {
        toast('حدث خطأ ما', {
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

      setUserDeleted(data.userDeleted ?? 0)
      setTimeout(() => refresh(), DEFAULT_DURATION)
    } catch (error) {
      toast('حدث خطأ ما', {
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
      console.error('Error =>', error)
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
                          variant={'destructive'}
                          onClick={async () => {
                            await deleteUser(
                              user.shms_id,
                              user.shms_doc?.split('/').pop() ?? ''
                            )
                          }}
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
