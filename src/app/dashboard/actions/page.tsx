
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  //CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TabsContent,
} from "@/components/ui/tabs";
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

  const invoices = [
    {
      stocks: "12",
      date: "23/01/2024",
    },
    {
        stocks: "24",
        date: "23/01/2024",
      },
      {
        stocks: "9",
        date: "23/01/2024",
      },
  ]

export default function DashboardActions(){
    return (
        <TabsContent dir="rtl" value="actions">
        <Card>
          <CardHeader>
            <CardTitle>اضافة اسهم جديدة</CardTitle>

          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">عدد الاسهم الجديدة</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">سعر السهم الواحد</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button> اضافة </Button>
          </CardFooter>
        </Card>

        <Card style={{marginTop:10}}>
        <Table className="min-w-full divide-y divide-gray-200">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead style={{textAlign:'center'}}>الاسهم المتاحة</TableHead>
              <TableHead style={{textAlign:'center'}}>تاريخ الاضافة</TableHead>
              <TableHead style={{textAlign:'center'}}>الاجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.stocks}>
                <TableCell style={{textAlign:'center'}}>{invoice.stocks}</TableCell>
                <TableCell style={{textAlign:'center'}}>{invoice.date}</TableCell>

                <TableCell style={{textAlign:'center'}}> <Button style={{backgroundColor:"red", margin:1}}>حذف</Button> <Button style={{margin:1}}>تعديل</Button> </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
        </Card>

      </TabsContent>
    )
}