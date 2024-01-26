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

const invoices = [
  {
    name: 'محمد عبدالرحيم محمد مكي',
    docType: 'جواز',
    docNumber: 'P20836146',
    stocks: '5'
  },
  {
    name: 'محمد بشير عوض الكريم',
    docType: 'بطاقة قطرية',
    docNumber: '200393552723',
    stocks: '10'
  }
]

export default function DashboardView() {
  return (
    <TabsContent value='view'>
      <div className='flex flex-wrap justify-center'>
        <Card style={{ margin: 10 }} dir='rtl' className='w-full md:w-[350px]'>
          <CardHeader>
            <CardTitle>عدد المساهمين</CardTitle>
            <CardDescription>153</CardDescription>
          </CardHeader>
          <CardContent>{/* Add your content here */}</CardContent>
          <CardFooter className='flex justify-between'>
            {/* Add your footer content here */}
          </CardFooter>
        </Card>

        <Card style={{ margin: 10 }} dir='rtl' className='w-full md:w-[300px]'>
          <CardHeader>
            <CardTitle> مجموع المبالغ المستثمرة </CardTitle>
            <CardDescription>6000</CardDescription>
          </CardHeader>
          <CardContent>{/* Add your content here */}</CardContent>
          <CardFooter className='flex justify-between'>
            {/* Add your footer content here */}
          </CardFooter>
        </Card>

        <Card style={{ margin: 10 }} dir='rtl' className='w-full md:w-[300px]'>
          <CardHeader>
            <CardTitle> عدد الاسهم </CardTitle>
            <CardDescription>6000</CardDescription>
          </CardHeader>
          <CardContent>{/* Add your content here */}</CardContent>
          <CardFooter className='flex justify-between'>
            {/* Add your footer content here */}
          </CardFooter>
        </Card>
      </div>

      <div style={{ width: '100%', display: 'flex' }}>
        <Card dir='rtl' style={{ width: '100%' }} className='w-full md:w-[300px]'>
          <CardHeader dir='rtl'>
            <CardTitle> المستثمرين </CardTitle>
            <CardDescription>30</CardDescription>
          </CardHeader>
          <CardContent>
            <Table className='min-w-full divide-y divide-gray-200'>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ textAlign: 'center' }}>الاسم</TableHead>
                  <TableHead style={{ textAlign: 'center' }}>نوع المستند</TableHead>
                  <TableHead style={{ textAlign: 'center' }}>رقم المستند</TableHead>
                  <TableHead style={{ textAlign: 'center' }}>عدد الاسهم</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(invoice => (
                  <TableRow key={invoice.name}>
                    <TableCell style={{ textAlign: 'center' }}>{invoice.name}</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {invoice.docType}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {invoice.docNumber}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      {invoice.stocks}
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
