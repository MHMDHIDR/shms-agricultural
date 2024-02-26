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
import { API_URL, APP_LOGO, DEFAULT_DURATION } from '@/data/constants'
import { arabicDate, cn, getUserStokcs, redirect } from '@/lib/utils'
import type { UserProps } from '@/types'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/custom/ConfirmDialog'
import Layout from '@/components/custom/Layout'
import DashboardNav from '../DashboardNav'

export default function Users() {
  const [users, setUsers] = useState<UserProps[]>([])
  const [userStockLimit, setUserStockLimit] =
    useState<UserProps['shms_user_stock_limit']>(1)
  const [userTotalBalance, setUserTotalBalance] =
    useState<UserProps['shms_user_total_balance']>(0)
  const [userTotalWithdrawableBalance, setUserTotalWithdrawableBalance] =
    useState<UserProps['shms_user_withdrawable_balance']>(0)

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

  const updateUserStockLimitOrBalance = async (
    id: string,
    newValue: number,
    type: string
  ) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true })
      const { data }: { data: UserProps } = await axios.patch(
        `${API_URL}/users/updateStockLimitOrBalance/${id}`,
        { newValue, type }
      )

      if (data.userUpdated === 1) {
        toast(
          data.message ??
            `تم تحديث ${
              type === 'stockLimit'
                ? 'حد شراء الأسهم'
                : type === 'totalBalance'
                ? 'الرصيد الكلي'
                : 'الرصيد القابل للسحب'
            } بنجاح 👍🏼 .. جاري تحويلك`,
          {
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
          }
        )
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

  return (
    <Layout>
      <h1 className='text-2xl mt-20 mb-10 font-bold text-center'>العمــلاء</h1>
      <DashboardNav />

      <section className='container mx-auto'>
        <div style={{ width: '100%', display: 'flex' }}>
          <Card className='min-w-full'>
            <CardHeader dir='rtl'>
              <CardTitle>العدد الكلي</CardTitle>
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
                    <TableHead>الرصيد الكلي</TableHead>
                    <TableHead>الرصيد القابل للسحب</TableHead>
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
                            className='text-blue-500 transition-colors hover:font-bold hover:text-blue-700'
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
                        <TableCell className='min-w-40'>
                          {user.shms_user_total_balance ?? 0}
                        </TableCell>
                        <TableCell className='min-w-40'>
                          {user.shms_user_withdrawable_balance ?? 0}
                        </TableCell>
                        <TableCell className='flex min-w-56 gap-x-2'>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <span className='border py-1.5 px-4 rounded-md hover:bg-gray-100 transition-colors'>
                                الاجراء
                              </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='flex flex-col gap-y-1.5'>
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
                              <ConfirmDialog
                                StockLimit={user.shms_user_stock_limit ?? 1}
                                onClick={async () => {
                                  await updateUserStockLimitOrBalance(
                                    user.shms_id,
                                    userStockLimit!,
                                    'stockLimit'
                                  )
                                }}
                                onChange={e => setUserStockLimit(Number(e.target.value))}
                                formStatus={formStatus}
                              >
                                حد شراء الاسهم
                              </ConfirmDialog>
                              <ConfirmDialog
                                StockLimit={user.shms_user_total_balance ?? 1}
                                onClick={async () => {
                                  await updateUserStockLimitOrBalance(
                                    user.shms_id,
                                    userTotalBalance!,
                                    'totalBalance'
                                  )
                                }}
                                onChange={e =>
                                  setUserTotalBalance(Number(e.target.value))
                                }
                                formStatus={formStatus}
                              >
                                الرصيد الكلي
                              </ConfirmDialog>
                              <ConfirmDialog
                                StockLimit={user.shms_user_withdrawable_balance ?? 1}
                                onClick={async () => {
                                  await updateUserStockLimitOrBalance(
                                    user.shms_id,
                                    userTotalWithdrawableBalance!,
                                    'withdrawableBalance'
                                  )
                                }}
                                onChange={e =>
                                  setUserTotalWithdrawableBalance(Number(e.target.value))
                                }
                                formStatus={formStatus}
                              >
                                الرصيد القابل للسحب
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
      </section>
    </Layout>
  )
}
