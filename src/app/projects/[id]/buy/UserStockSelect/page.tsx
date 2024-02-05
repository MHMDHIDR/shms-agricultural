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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
  

export default function UserStockSelect() {
  const [users, setUsers] = useState<UserProps[]>([])


  const getUsers = async () => {
    const { data: users }: { data: UserProps[] } = await axios.get(`${API_URL}/users/all`)
    setUsers(users)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
 
    <Card className='min-w-full'>
      <CardHeader dir='rtl'>
        <CardTitle> المستخدمين </CardTitle>
        <CardDescription>{users.length ?? 0}</CardDescription>
      </CardHeader>
      <CardContent>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Stock Limit" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user, index) => (
              <SelectItem key={index} value={user.shms_id}>
                {user.shms_user_stock_limit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
    
  )
}