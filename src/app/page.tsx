import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { API_URL } from '@/data/constants'
import Layout from '@/components/custom/layout'
import Slider from '@/components/custom/slider'
import Counter from '@/components/custom/counter'
import Divider from '@/components/custom/divider'
import ImageGallery from './dashboard/image-gallery'
import { NavigateTop } from '@/components/custom/navigate-top'
import { images } from '@/libs/utils'
import type { Users } from '@prisma/client'

export default async function Home() {
  let USERS_COUNT = 0
  const { data: users }: { data: Users[] } = await axios.get(`${API_URL}/users/all`)
  // users count
  if (users) {
    USERS_COUNT = users.length
  }

  return (
    <Layout>
      {/* Try to build a way to fetch images from backend api (uploaded on the dashboard & stored in AWS S3) */}
      <Slider images={images(7)} />
      <section className='flex flex-col items-center justify-between min-h-screen p-8 md:p-24'>
        <h1 className='mb-8 text-2xl md:text-4xl md:mb-12'>مرحباً بكم في شمــس</h1>
        <div className='flex flex-col items-center md:flex-row md:gap-8'>
          <div className='flex flex-col items-center md:flex-row'>
            <div className='flex items-center justify-center w-full bg-transparent md:w-500 md:h-500 hover:opacity-90 hover:-translate-y-1 transition'>
              <div className='bg-green-700 min-w-72 min-h-48 md:w-80 md:h-60 rounded-tr-[6.5rem] rounded-bl-[6.5rem] mb-80 -mr-52'>
                <h1 className='p-12 pt-8 text-6xl font-bold text-white select-none counter'>
                  <small className='block text-sm text-right'>عدد العملاء</small>
                  <Counter number={USERS_COUNT} />
                  <span className='inline-block ml-2 rotate-45'>&times;</span>
                </h1>
              </div>
              <Image
                src='/static-images/vision-image-home.jpg'
                alt='Image 1'
                width={400}
                height={400}
                className='object-cover border-4 rounded-full min-w-80 min-h-80 aspect-square border-darkgreen'
              />
            </div>
            <div className='flex flex-col items-center justify-start mt-4 md:mt-0'>
              <h1 className='text-xl md:-mt-32 md:text-2xl md:mb-12 underline-hover'>
                رؤيتنا
              </h1>
              <p className='flex-1 text-lg text-center text-gray-800 leading-10 dark:text-white'>
                أن يكون السودان هو فعليا سلة غذاء العالم وان يكون رائداً بين الدول العربية
                في مجال الزراعة وتطوير الادوات الزراعية وتحسين جودة المزروعات مما يسهم
                بشكل كبير في النمو الاقتصادي للفرد وللدولة على حد سواء
              </p>
            </div>
          </div>
        </div>
        <div
          style={{ margin: 30 }}
          dir='rtl'
          className='grid grid-cols-1 md:grid-cols-4 gap-8'
        >
          <Link href={'/projects'}>
            <div className='w-full bg-transparent md:w-500 md:h-500 hover:opacity-90 hover:-translate-y-1 transition'>
              <div>
                <h2
                  style={{
                    textAlign: 'center',
                    fontSize: 30,
                    fontWeight: 'bold'
                  }}
                >
                  استثمار
                </h2>

                <Image
                  src='https://www.agroinvestspain.com/wp-content/uploads/2020/05/agricultural-investment.jpeg'
                  alt='Image 1'
                  width={500}
                  height={500}
                  className='object-cover w-full h-full'
                  style={{
                    aspectRatio: '1/1',
                    borderWidth: 2.5,
                    borderColor: 'darkgreen',
                    borderRadius: 20,
                    marginTop: 15
                  }}
                />
              </div>
            </div>
          </Link>

          <Link href={'/preparation'}>
            <div className='w-full bg-transparent md:w-500 md:h-500 hover:opacity-90 hover:-translate-y-1 transition'>
              <div>
                <h2
                  style={{
                    textAlign: 'center',
                    fontSize: 30,
                    fontWeight: 'bold'
                  }}
                >
                  تحضير
                </h2>

                <Image
                  src='/preparation.jpg'
                  alt='Image 1'
                  width={500}
                  height={500}
                  className='object-cover w-full h-full'
                  style={{
                    aspectRatio: '1/1',
                    borderWidth: 2.5,
                    borderColor: 'darkgreen',
                    borderRadius: 20,
                    marginTop: 15
                  }}
                />
              </div>
            </div>
          </Link>

          <Link href={'/farming'}>
            <div className='w-full bg-transparent md:w-500 md:h-500 hover:opacity-90 hover:-translate-y-1 transition'>
              <div>
                <h2
                  style={{
                    textAlign: 'center',
                    fontSize: 30,
                    fontWeight: 'bold'
                  }}
                >
                  زراعة
                </h2>

                <Image
                  src='/farming.png'
                  alt='Image 2'
                  width={500}
                  height={500}
                  className='object-cover w-full h-full'
                  style={{
                    aspectRatio: '1/1',
                    borderWidth: 2.5,
                    borderColor: 'darkgreen',
                    borderRadius: 20,
                    marginTop: 15
                  }}
                />
              </div>
            </div>
          </Link>

          <Link href={'/harvest'}>
            <div className='w-full bg-transparent md:w-500 md:h-500 hover:opacity-90 hover:-translate-y-1 transition'>
              <div>
                <h2
                  style={{
                    textAlign: 'center',
                    fontSize: 30,
                    fontWeight: 'bold'
                  }}
                >
                  حصاد
                </h2>

                <Image
                  src='/harvest.webp'
                  alt='Image 3'
                  width={500}
                  height={500}
                  className='object-cover w-full h-full'
                  style={{
                    aspectRatio: '1/1',
                    borderWidth: 2.5,
                    borderColor: 'darkgreen',
                    borderRadius: 20,
                    marginTop: 15
                  }}
                />
              </div>
            </div>
          </Link>
        </div>
        <Divider className='my-10' />
        <h1 className='mb-8 text-2xl mt-14 md:text-4xl md:mb-12 underline-hover'>
          معرض الصور
        </h1>
        <ImageGallery />
      </section>
      <NavigateTop />
    </Layout>
  )
}
