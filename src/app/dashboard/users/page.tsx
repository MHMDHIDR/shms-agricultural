
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    //TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {

    TabsContent,

  } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";


const invoices = [
    {
      name: "محمد عبدالرحيم محمد مكي",
      date: "23/01/2024",
      phone: "33553790",
      email: "mohamedabdo2381998@gmail.com",
      status: "نشط",
      stocks: "5",
    },
    {
        name: "محمد حيدر الطاهر",
        date: "23/01/2024",
        phone: "66827303",
        email: "mhmdhaider227@gmail.com",
        status: "نشط",
        stocks: "10",
      },
      {
        name: "محمد بشير عوض الكريم",
        date: "23/01/2024",
        phone: "6863638",
        email: "beshoo33@gmail.com",
        status: "نشط",
        stocks: "50",
      },
  ]

export default function Users (){


    return (

        <TabsContent dir="rtl" value="users">
  
        <div style={{ width:'100%', display:'flex'}}>
  
        <Card style={{width:'100%'}} className="w-full md:w-[300px]">
            <CardHeader dir="rtl">
              <CardTitle>  المستثمرين   </CardTitle>
              <CardDescription>30</CardDescription>
            </CardHeader>
            <CardContent>
  
         
        <Table className="min-w-full divide-y divide-gray-200">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead style={{textAlign:'center'}}>الاسم</TableHead>
              <TableHead style={{textAlign:'center'}}>تاريخ التسجيل</TableHead>
              <TableHead style={{textAlign:'center'}}>رقم الهاتف</TableHead>
              <TableHead style={{textAlign:'center'}}>البريد الالكتروني</TableHead>
              <TableHead style={{textAlign:'center'}}>حالة المستخدم</TableHead>
              <TableHead style={{textAlign:'center'}}>عدد الاسهم</TableHead>
              <TableHead style={{textAlign:'center'}}>الاجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.name}>
                <TableCell style={{textAlign:'center'}}>{invoice.name}</TableCell>
                <TableCell style={{textAlign:'center'}}>{invoice.date}</TableCell>
                <TableCell style={{textAlign:'center'}}>{invoice.phone}</TableCell>
                <TableCell style={{textAlign:'center'}}>{invoice.email}</TableCell>
                <TableCell style={{textAlign:'center'}}>{invoice.status}</TableCell>
                <TableCell style={{textAlign:'center'}}>{invoice.stocks}</TableCell>
                <TableCell style={{textAlign:'center'}}> <Button style={{backgroundColor:"red", margin:1}}>حذف</Button> <Button style={{margin:1}}>تعديل</Button> </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
    
  
            </CardContent>
            <CardFooter className="flex justify-between">
              {/* Add your footer content here */}
            </CardFooter>
          </Card>
  
        </div>
        </TabsContent>

    )
}