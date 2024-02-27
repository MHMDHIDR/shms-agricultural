'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { API_URL } from '@/data/constants'
import type { UserProps } from '@/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Layout from '@/components/custom/Layout'
import DashboardNav from '../DashboardNav'
import DataTable from '@/components/custom/DataTable'

export default function Users() {
  const [users, setUsers] = useState<UserProps[]>([])

  const getUsers = async () => {
    const { data: users }: { data: UserProps[] } = await axios.get(`${API_URL}/users/all`)
    setUsers(users)
  }

  useEffect(() => {
    getUsers()
  }, [])

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
              <DataTable data={users} />
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  )
}
