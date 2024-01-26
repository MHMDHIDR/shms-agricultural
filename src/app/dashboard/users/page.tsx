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
  CardFooter,
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

export default async function Users() {
  const { data: users }: { data: UserProps[] } = await axios.get(`${API_URL}/users/all`)

  return (
    <TabsContent dir='rtl' value='users'>
      <div style={{ width: '100%', display: 'flex' }}>
        <Card style={{ width: '100%' }} className='w-full md:w-[300px]'>
          <CardHeader dir='rtl'>
            <CardTitle> المستخدمين </CardTitle>
            <CardDescription>{users.length ?? 0}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table className='min-w-full divide-y divide-gray-200 text-center'>
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
                {users.map(user => (
                  <TableRow key={user.shms_id}>
                    <TableCell className='min-w-32'>{user.shms_fullname}</TableCell>
                    <TableCell className='min-w-32'>
                      {arabicDate(user.shms_created_at ?? '')}
                    </TableCell>
                    <TableCell className='min-w-32'>{user.shms_phone}</TableCell>
                    <TableCell className='min-w-32'>{user.shms_email}</TableCell>
                    <TableCell className='min-w-32'>
                      {user.shms_user_account_status === 'active' ? 'نشط' : 'غير نشط'}
                    </TableCell>
                    <TableCell className='min-w-32'>
                      {user.shms_user_stocks ?? 'لم يتم شراء أسهم بعد'}
                    </TableCell>
                    <TableCell className='min-w-56 flex gap-x-2'>
                      <Confirm className='bg-red-500 hover:bg-red-600'>حذف</Confirm>
                      <Modal
                        title={`صورة المستند ل ${user.shms_fullname}`}
                        document={user.shms_doc ?? APP_LOGO}
                      >
                        عرض المستند
                      </Modal>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className='flex justify-between'>
            {/* Add your footer content here */}
          </CardFooter>
        </Card>
      </div>
    </TabsContent>
  )
}
