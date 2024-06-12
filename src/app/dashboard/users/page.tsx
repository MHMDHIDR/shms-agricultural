'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { API_URL } from '@/data/constants'
import type { UserLoggedInProps, UserProps } from '@/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Layout from '@/components/custom/Layout'
import DashboardNav from '../DashboardNav'
import DataTable from '@/components/custom/DataTable'
import { useSession } from 'next-auth/react'
import NotFound from '@/app/not-found'
import { LoadingPage } from '@/components/custom/Loading'
import { getAuth } from '@/libs/actions/auth'

export default function Users() {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const [users, setUsers] = useState<UserProps[]>([])
  const [userType, setUserType] = useState<UserProps['shms_user_account_type']>('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      const { userType, loading } = await getAuth()
      setUserType(userType)
      setLoading(loading)

      if (!loading) {
        const { data: users }: { data: UserProps[] } = await axios.get(
          `${API_URL}/users/all`
        )
        setUsers(users)
      }
    }

    getUserData()
  }, [session])

  return loading ? (
    <LoadingPage />
  ) : !session && userType === 'user' ? (
    <NotFound />
  ) : (
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
              <DataTable data={users} />
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  )
}
