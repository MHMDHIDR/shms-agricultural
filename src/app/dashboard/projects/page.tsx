'use client'

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
import FileUpload from '@/components/custom/FileUpload'

export default function Projects() {
  return (
    <TabsContent dir='rtl' value='projects'>
      <Card>
        <CardHeader>
          <CardTitle>اضافة مشروع جديد</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='grid grid-cols-2 grid-rows-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            <FileUpload
              data={{
                defaultImg: [
                  {
                    docImgDisplayName: 'Tree',
                    docImgDisplayPath: 'https://source.unsplash.com/random?tree'
                  }
                ],
                imgName: 'Agricultural Project View'
              }}
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='current'> اسم المشروع </Label>
            <Input id='current' type='text' />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='new'> منطقة المشروع </Label>
            <Input id='new' type='text' />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='new'> تاريخ بداية المشروع </Label>
            <div className='md:w-3/3'>
              <input
                id='dateOfStart'
                //onChange={e => setDateOfBirth(e.target.value)}
                className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                type='date'
                min='1990-01-01'
                max={
                  // todays date - 18 years
                  new Date(
                    new Date().getFullYear() - 18,
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                    .toISOString()
                    .split('T')[0]
                }
              />
            </div>
          </div>

          <div className='space-y-1'>
            <Label htmlFor='new'> تاريخ نهاية المشروع </Label>
            <div className='md:w-3/3'>
              <input
                id='dateOfEnd'
                //onChange={e => setDateOfBirth(e.target.value)}
                className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                type='date'
                min='1990-01-01'
                max={
                  // todays date - 18 years
                  new Date(
                    new Date().getFullYear() - 18,
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                    .toISOString()
                    .split('T')[0]
                }
              />
            </div>
          </div>

          <div className='space-y-1'>
            <Label htmlFor='new'> اخر موعد للمساهمة </Label>
            <div className='md:w-3/3'>
              <input
                id='dateOfEnd'
                //onChange={e => setDateOfBirth(e.target.value)}
                className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                type='date'
                min='1990-01-01'
                max={
                  // todays date - 18 years
                  new Date(
                    new Date().getFullYear() - 18,
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                    .toISOString()
                    .split('T')[0]
                }
              />
            </div>
          </div>

          <div className='space-y-1'>
            <Label htmlFor='new'> قيمة السهم الواحد </Label>
            <Input id='new' type='text' />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='new'> ارباح السهم الواحد </Label>
            <Input id='new' type='text' />
          </div>

          <div className='space-y-1'>
            <Label htmlFor='new'> وصف المشروع </Label>
            <textarea
              className='w-full px-4 py-2 leading-tight text-right text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
              placeholder='أدخل وصف المشروع'
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button> اضافة </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
