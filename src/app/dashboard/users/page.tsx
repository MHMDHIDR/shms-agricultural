'use client'

import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { FormStatusContext } from '@/providers/form-status'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { API_URL } from '@/data/constants'
import Layout from '@/components/custom/layout'
import DashboardNav from '../dashboard-nav'
import DataTable from '@/components/custom/data-table'
import NotFound from '@/app/not-found'
import { LoadingPage } from '@/components/custom/loading'
import { getAuth } from '@/libs/actions/auth'
import type { FormStatusProps, UserLoggedInProps } from '@/types'
import type { Users } from '@prisma/client'

export default function Users() {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const [users, setUsers] = useState<Users[]>([])
  const [userType, setUserType] = useState<Users['shms_user_account_type']>('user')
  const [loading, setLoading] = useState(true)
  const { formStatus } = useContext<FormStatusProps>(FormStatusContext)

  useEffect(() => {
    const getUserData = async () => {
      const { userType, loading } = await getAuth()
      setUserType(userType)

      if (!loading) {
        const { data: users }: { data: Users[] } = await axios.get(`${API_URL}/users/all`)
        setUsers(users)
      }

      setLoading(loading)
    }

    getUserData()
  }, [session, formStatus])

  return loading ? (
    <LoadingPage />
  ) : !session && userType === 'user' ? (
    <NotFound />
  ) : (
    <Layout>
      <h1 className='mt-20 mb-10 text-2xl font-bold text-center'>العمــلاء</h1>
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
