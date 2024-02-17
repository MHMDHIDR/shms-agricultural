'use client'

import Confirm from '@/components/custom/Confirm'
import Modal from '@/components/custom/Modal'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Error, Success } from '@/components/icons/Status'
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
import { arabicDate, cn, redirect } from '@/lib/utils'
import type { UserProps, stocksPurchasedProps } from '@/types'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/custom/ConfirmDialog'

export default function Users() {
  const [users, setUsers] = useState<UserProps[]>([])
  const [userStockLimit, setUserStockLimit] =
    useState<UserProps['shms_user_stock_limit']>(1)

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })

  const [userDeleted, setUserDeleted] = useState<UserProps['userDeleted']>(0)
  const [userUpdated, setUserUpdated] = useState<UserProps['userUpdated']>(0)

  const getUsers = async () => {
    const { data: users }: { data: UserProps[] } = await axios.get(`${API_URL}/users/all`)
    setUsers(users)
  }

  useEffect(() => {
    getUsers()
  }, [userDeleted, userUpdated])

  const deleteUser = async (id: string, S3docId: string) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })
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
      // redirect('/dashboard')
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
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
      console.error('Error =>', error)
    }
  }

  const toggleUserStatus = async (
    id: string,
    status: UserProps['shms_user_account_status']
  ) => {
    try {
      const { data }: { data: UserProps } = await axios.patch(
        `${API_URL}/users/toggleStatus/${id}`,
        { status }
      )

      if (data.userUpdated === 1) {
        toast(data.message ?? 'تم تحديث حالة المستخدم بنجاح 👍🏼', {
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

      setUserUpdated(data.userUpdated ?? 0)
      redirect('/dashboard')
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

  const updateUserStockLimit = async (id: string, stockLimit: number) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })
      const { data }: { data: UserProps } = await axios.patch(
        `${API_URL}/users/updateStockLimit/${id}`,
        { stockLimit }
      )

      if (data.userUpdated === 1) {
        toast(data.message ?? 'تم تحديث حد شراء الاسهم بنجاح 👍🏼', {
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

      setUserUpdated(data.userUpdated ?? 0)
      redirect('/dashboard')
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
    } finally {
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
    }
  }

  const getUserStokcs = (user: UserProps) => {
    const USER_STOCKS = JSON.parse(
      String(user.shms_user_stocks)
    ) as stocksPurchasedProps[]
    // count the stock in the USER_STOCKS array
    return USER_STOCKS && USER_STOCKS.reduce((acc, stock) => acc + stock.stocks, 0)
  }

  return (
    <TabsContent dir='rtl' value='users' className='mt-20 md:mt-5'>
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
                  <TableHead>حد شراء الأسهم</TableHead>
                  <TableHead>الاجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!users || users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className='space-y-6'>
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
                      <TableCell className='min-w-40'>
                        <Link
                          href={`tel:${user.shms_phone}`}
                          className='text-blue-500 hover:font-bold hover:text-blue-700 transition-colors'
                        >
                          {user.shms_phone}
                        </Link>
                      </TableCell>
                      <TableCell className='min-w-40'>{user.shms_email}</TableCell>
                      <TableCell
                        className={
                          user.shms_user_account_status === 'active'
                            ? 'text-green-600'
                            : user.shms_user_account_status === 'block'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }
                      >
                        {user.shms_user_account_status === 'active'
                          ? 'نشط'
                          : user.shms_user_account_status === 'block'
                          ? 'محظور'
                          : 'غير مفعل'}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'min-w-40',
                          getUserStokcs(user) > 0
                            ? 'text-gray-600 font-bold'
                            : 'text-gray-400'
                        )}
                      >
                        {getUserStokcs(user) ?? 'لم يتم شراء اي اسهم'}
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {user.shms_user_stock_limit ?? 1}
                      </TableCell>
                      <TableCell className='flex min-w-56 gap-x-2'>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <span className='border py-1.5 px-4 rounded-md hover:bg-gray-100 transition-colors'>
                              الاجراء
                            </span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className='space-y-2 max-w-20'>
                            {/* Delete Button */}
                            <Confirm
                              variant={'destructive'}
                              onClick={async () => {
                                await deleteUser(
                                  user.shms_id,
                                  user.shms_doc?.split('/').pop() ?? ''
                                )
                              }}
                              className='w-full'
                              isLoading={formStatus.isSubmitting}
                            >
                              حذف
                            </Confirm>
                            {/* Toggle User Status Button */}
                            <Confirm
                              variant={'secondary'}
                              onClick={async () => {
                                await toggleUserStatus(
                                  user.shms_id,
                                  user.shms_user_account_status === 'block'
                                    ? 'active'
                                    : user.shms_user_account_status === 'pending'
                                    ? 'active'
                                    : 'block'
                                )
                              }}
                              className='w-full bg-gray-200'
                            >
                              {user.shms_user_account_status === 'block'
                                ? 'تفعيل'
                                : user.shms_user_account_status === 'pending'
                                ? 'تفعيل الحساب'
                                : 'تعطيل'}
                            </Confirm>
                            {/* User Stock Limit */}
                            <ConfirmDialog
                              StockLimit={user.shms_user_stock_limit ?? 1}
                              onClick={async () => {
                                await updateUserStockLimit(user.shms_id, userStockLimit!)
                              }}
                              onChange={e => setUserStockLimit(Number(e.target.value))}
                              formStatus={formStatus}
                            >
                              حد شراء الاسهم
                            </ConfirmDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
