'use client'

import { useEffect, useState } from 'react'
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
import axios from 'axios'
import { API_URL, APP_LOGO } from '@/data/constants'
import type { UserProps } from '@/types'
import { arabicDate } from '@/lib/utils'
import Confirm from '@/components/custom/Confirm'
import Modal from '@/components/custom/Modal'
import { Skeleton } from '@/components/ui/skeleton'

export default function Users() {
  const [users, setUsers] = useState<UserProps[]>([])

  useEffect(() => {
    const getUsers = async () => {
      const { data: users }: { data: UserProps[] } = await axios.get(
        `${API_URL}/users/all`
      )
      setUsers(users)
    }
    getUsers()
  }, [])

  const deleteUser = async (id: string) => {
    const deletedUser = await axios.delete(`${API_URL}/users/delete/${id}`)
    console.log('deletedUser  id --->', deletedUser)
  }

  return (
    <TabsContent dir='rtl' value='users'>
      <div style={{ width: '100%', display: 'flex' }}>
        <Card className='min-w-full'>
          <form>
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
                            className='bg-red-500 hover:bg-red-600'
                            onClick={async () => await deleteUser(user.shms_id)}
                          >
                            حذف
                          </Confirm>
                          <Modal
                            title={`صورة المستند لــ ${user.shms_fullname}`}
                            document={user.shms_doc ?? APP_LOGO}
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
          </form>
        </Card>
      </div>
    </TabsContent>
  )
}
