import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const invoices = [
  {
    stocks: '12',
    date: '23/01/2024'
  },
  {
    stocks: '24',
    date: '23/01/2024'
  },
  {
    stocks: '9',
    date: '23/01/2024'
  }
]

export default function DashboardStocks() {
  return (
    <TabsContent dir='rtl' value='stocks'>
      <Card>
        <CardHeader>
          <CardTitle>اضافة اسهم جديدة</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='space-y-1'>
            <Label htmlFor='current'>عدد الاسهم الجديدة</Label>
            <Input id='current' type='password' />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='new'>سعر السهم الواحد</Label>
            <Input id='new' type='password' />
          </div>
        </CardContent>
        <CardFooter>
          <Button> اضافة </Button>
        </CardFooter>
      </Card>

      <Card style={{ marginTop: 10 }}>
        <Table className='min-w-full divide-y divide-gray-200'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>الاسهم المتاحة</TableHead>
              <TableHead className='text-center'>تاريخ الاضافة</TableHead>
              <TableHead className='text-center'>الاجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(invoice => (
              <TableRow key={invoice.stocks}>
                <TableCell className='text-center'>{invoice.stocks}</TableCell>
                <TableCell className='text-center'>{invoice.date}</TableCell>
                <TableCell className='flex justify-center gap-2'>
                  <Button className='font-bold bg-red-500 hover:bg-red-600 dark:text-white'>
                    حذف
                  </Button>
                  <Button variant={'outline'}>تعديل</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </TabsContent>
  )
}
