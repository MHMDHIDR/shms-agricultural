import Layout from '@/components/custom/Layout'
import Slider from '@/components/custom/Slider'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  // get images from backend api (uploaded to dashboard by admin stored in AWS S3)
  const images = [
    'https://source.unsplash.com/featured/?flowers',
    'https://source.unsplash.com/featured/?plants',
    'https://source.unsplash.com/featured/?apples',
    'https://source.unsplash.com/featured/?berries',
    'https://source.unsplash.com/featured/?oranges',
    'https://source.unsplash.com/featured/?penuts',
    'https://source.unsplash.com/featured/?trees',
    'https://source.unsplash.com/featured/?palms'
  ]

  return (
    <Layout>
      <Slider images={images} />
      <section className='flex flex-col items-center justify-between min-h-screen p-8 md:p-24'>
        <h1 className='text-2xl md:text-4xl mb-8 md:mb-12'>مرحباً بكم في شمــس</h1>

        <h1 style={{ marginTop: 50 }} className='text-2xl md:text-4xl mb-8 md:mb-12'>
          رؤيتنا
        </h1>

        <div className='flex flex-col items-center md:flex-row md:gap-8'>
          <div className='w-full md:w-500 md:h-500 bg-transparent hover:opacity-90 hover:-translate-y-1 transition flex items-center justify-center'>
            <Image
              src='https://assets.raya.com/wp-content/uploads/2020/11/03220331/951165.jpeg'
              alt='Image 1'
              width={500}
              height={500}
              className='w-full h-full object-cover rounded-full border-4 border-darkgreen'
              style={{ maxWidth: '80%' }}
            />
          </div>
          <div className='mt-4 md:mt-0'>
            <p className='text-center' style={{ color: 'gray', fontSize: 15 }}>
              ان يكون السودان هو فعليا سلة غذاء العالم وان يكون رائدا بين الدول العربية في
              مجال الزراعة وتطوير الادوات الزراعية وتحسين جودة المزروعات مما يسهم بشكل
              كبير في النمو الاقتصادي للفرد وللدولة على حد سواء
            </p>
          </div>
        </div>

        <div
          style={{ margin: 30 }}
          dir='rtl'
          className='grid grid-cols-1 md:grid-cols-4 gap-8'
        >
          <Link href={'/projects'}>
            <div className='w-full md:w-500 md:h-500 bg-transparent hover:opacity-90 hover:-translate-y-1 transition'>
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
                <p style={{ color: 'gray', fontSize: 15, textAlign: 'center' }}>
                  وهي مرحلة تصفح المشاريع المتاحة و شراء الاسهم
                </p>
                <Image
                  src='https://www.agroinvestspain.com/wp-content/uploads/2020/05/agricultural-investment.jpeg'
                  alt='Image 1'
                  width={500}
                  height={500}
                  className='w-full h-full object-cover'
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
            <div className='w-full md:w-500 md:h-500 bg-transparent hover:opacity-90 hover:-translate-y-1 transition'>
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
                <p style={{ color: 'gray', fontSize: 15, textAlign: 'center' }}>
                  وهية مرحلة تجهيز الارض من نظافة و عزق و حراثة
                </p>
                <Image
                  src='/preparation.jpg'
                  alt='Image 1'
                  width={500}
                  height={500}
                  className='w-full h-full object-cover'
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
            <div className='w-full md:w-500 md:h-500 bg-transparent hover:opacity-90 hover:-translate-y-1 transition'>
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
                <p style={{ color: 'gray', fontSize: 15, textAlign: 'center' }}>
                  وهي مرحلة رمي البذور في الارض ومتابعة الري وسير الزراعة
                </p>
                <Image
                  src='/farming.png'
                  alt='Image 2'
                  width={500}
                  height={500}
                  className='w-full h-full object-cover'
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
            <div className='w-full md:w-500 md:h-500 bg-transparent hover:opacity-90 hover:-translate-y-1 transition'>
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
                <p style={{ color: 'gray', fontSize: 15, textAlign: 'center' }}>
                  وهية مرحلة جمع المحصول من الارض والبدء بتجهيزه للتخزين
                </p>
                <Image
                  src='/harvest.webp'
                  alt='Image 3'
                  width={500}
                  height={500}
                  className='w-full h-full object-cover'
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

        <h1 style={{ marginTop: 30 }} className='text-2xl md:text-4xl mb-8 md:mb-12'>
          معرض الصور
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            marginTop: 30
          }}
        >
          <div>
            <Image
              src='https://modo3.com/thumbs/fit630x300/142458/1478984574/%D9%85%D8%B1%D8%A7%D8%AD%D9%84_%D8%A7%D9%84%D8%B2%D8%B1%D8%A7%D8%B9%D8%A9.jpg'
              alt='Image 1'
              width={500}
              height={500}
              className='w-full h-full object-cover'
              style={{
                aspectRatio: '1/1',
                borderWidth: 2.5,
                borderColor: 'darkgreen',
                borderRadius: 20,
                marginTop: 15,
                width: '90%',
                height: '90%'
              }}
            />
          </div>

          <div>
            <Image
              src='http://media.kenanaonline.com/photos/1238365/1238365363/large_1238365363.jpg?1394703600'
              alt='Image 1'
              width={500}
              height={500}
              className='w-full h-full object-cover'
              style={{
                aspectRatio: '1/1',
                borderWidth: 2.5,
                borderColor: 'darkgreen',
                borderRadius: 20,
                marginTop: 15,
                width: '90%',
                height: '90%'
              }}
            />
          </div>

          <div style={{ marginTop: 30 }}>
            <Image
              src='https://mqalla.com/wp-content/uploads/%D8%AD%D8%B5%D8%A7%D8%AF-%D8%A7%D9%84%D9%82%D9%85%D8%AD.jpg'
              alt='Image 1'
              width={500}
              height={500}
              className='w-full h-full object-cover'
              style={{
                aspectRatio: '1/1',
                borderWidth: 2.5,
                borderColor: 'darkgreen',
                borderRadius: 20,
                marginTop: 15,
                width: '90%',
                height: '90%'
              }}
            />
          </div>

          <div style={{ marginTop: 30 }}>
            <Image
              src='https://maan.gov.ae/wp-content/uploads/2021/02/Social-Investment-Fund-2048x1365.jpg'
              alt='Image 1'
              width={500}
              height={500}
              className='w-full h-full object-cover'
              style={{
                aspectRatio: '1/1',
                borderWidth: 2.5,
                borderColor: 'darkgreen',
                borderRadius: 20,
                marginTop: 15,
                width: '90%',
                height: '90%'
              }}
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}
