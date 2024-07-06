'use client'

import { useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getUserMoneyOperations } from '@/libs/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import DataTable from '@/components/custom/data-table'
import Layout from '@/components/custom/layout'
import DashboardNav from '../dashboard-nav'
import NotFound from '@/app/not-found'
import { getAuth } from '@/libs/actions/auth'
import { LoadingPage } from '@/components/custom/loading'
import { FormStatusContext } from '@/providers/form-status'
import type { FormStatusProps, UserLoggedInProps } from '@/types'
import type { Users, withdraw_actions } from '@prisma/client'

export default function MoneyOperations() {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const [userType, setUserType] = useState<Users['shms_user_account_type']>('user')
  const [loading, setLoading] = useState(true)
  const [withdrawActions, setWithdrawActions] = useState<withdraw_actions[]>([])
  const { formStatus } = useContext<FormStatusProps>(FormStatusContext)

  // const { userType, loading } = await getAuth()

  useEffect(() => {
    // const withdrawActions = await getUserMoneyOperations()
    const getWithdrawActions = async () => {
      const withdrawActions: withdraw_actions[] = await getUserMoneyOperations()
      setWithdrawActions(withdrawActions)
    }

    getWithdrawActions()
  }, [session, formStatus])

  useEffect(() => {
    const getUserData = async () => {
      const { userType, loading } = await getAuth()
      setUserType(userType)
      setLoading(loading)
    }

    getUserData()
  }, [])

  return loading ? (
    <LoadingPage />
  ) : !session && userType === 'user' ? (
    <NotFound />
  ) : (
    <Layout>
      <h1 className='mt-20 mb-10 text-2xl font-bold text-center'>العمليات المالية</h1>
      <DashboardNav />

      <section className='container mx-auto'>
        <Card className='min-w-full'>
          <CardHeader dir='rtl' className='select-none'>
            <CardTitle className='text-center'>
              عمليات السحب والإيداع
              <strong className='px-2 mr-4 border rounded-sm'>
                {withdrawActions.length ?? 0}
              </strong>
            </CardTitle>
            <CardDescription>
              هنا يمكنك مشاهدة جميع عمليات السحب والإيداع التي تمت في الموقع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={withdrawActions} />
          </CardContent>
        </Card>
      </section>
    </Layout>
  )
}
