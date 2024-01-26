'use client'
import * as React from 'react'
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

export default function Projects() {
  return (
    <TabsContent dir='rtl' value='projects'>
      <Card>
        <CardHeader>
          <CardTitle>اضافة مشروع جديد</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='space-y-1'>
            <Label htmlFor='current'> صور المشروع </Label>
            <div>مكان رفع الصور</div>
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
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-right'
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
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-right'
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
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-right'
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
              className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 text-right'
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
