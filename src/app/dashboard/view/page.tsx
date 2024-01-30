import Modal from '@/components/custom/Modal'
import NoRecords from '@/components/custom/NoRecords'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TabsContent } from '@/components/ui/tabs'
import { API_URL, APP_LOGO } from '@/data/constants'
import type { UserProps } from '@/types'
import axios from 'axios'

export default async function DashboardView() {
  const { data: users }: { data: UserProps[] } = await axios.get(
    `${API_URL}/users/all?role=investor`
  )

  return (
    <TabsContent value='view'>
      <div className='flex flex-wrap justify-center gap-2.5 my-4'>
        <Card className='w-full text-center md:w-[350px]'>
          <CardHeader>
            <CardTitle>عدد المساهمين</CardTitle>
            <CardDescription className='text-2xl pt-4'>
              <strong>{users.length}</strong>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className='w-full text-center md:w-[300px]'>
          <CardHeader>
            <CardTitle>مجموع المبالغ المستثمرة</CardTitle>
            <CardDescription className='text-2xl pt-4'>
              <strong>153</strong>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className='w-full text-center md:w-[300px]'>
          <CardHeader>
            <CardTitle>عدد الاسهم</CardTitle>
            <CardDescription className='text-2xl pt-4'>
              <strong>153</strong>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div style={{ width: '100%', display: 'flex' }}>
        <Card dir='rtl' style={{ width: '100%' }} className='w-full md:w-[300px]'>
          <CardHeader>
            <CardTitle>المستثمرين</CardTitle>
            {
              <CardDescription className='text-l pt-2'>
                <small>
                  <strong>لديك {users.length} مستثمر</strong>
                </small>
              </CardDescription>
            }
          </CardHeader>
          <CardContent>
            {!users || users.length === 0 ? (
              <NoRecords msg='لم يتم العثور على مستثمرين في الوقت الحالي!' />
            ) : (
              <Table className='min-w-full divide-y divide-gray-200'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-right'>الاسم</TableHead>
                    <TableHead className='text-right'>عدد الاسهم</TableHead>
                    <TableHead className='text-right'>المستند الشخصي</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.shms_id}>
                      <TableCell className='text-right'>{user.shms_fullname}</TableCell>
                      <TableCell className='text-right'>
                        {user.shms_user_stocks?.length}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Modal
                          title={`صورة المستند لــ ${user.shms_fullname}`}
                          document={user.shms_doc ?? APP_LOGO}
                          className='font-bold dark:text-white'
                        >
                          عرض المستند
                        </Modal>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}
