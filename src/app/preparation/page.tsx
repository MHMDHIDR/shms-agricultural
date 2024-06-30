import Layout from '@/components/custom/Layout'
import { Button } from '@/components/ui/button'
import { APP_DESCRIPTION, APP_TITLE } from '@/data/constants'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `التحضيــــــر | ${APP_TITLE}
}`,
  description: APP_DESCRIPTION
}

export default function Preparation() {
  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen'>
        <h1 className='mt-10 mb-2 text-2xl'>التحضير للموسم الزراعي</h1>

        <div dir='rtl' style={{ marginTop: 10, justifyContent: 'center' }}>
          <div style={{ margin: 50, display: 'flex', justifyContent: 'center' }}>
            <Image
              src='https://cdn.wikifarmer.com/wp-content/uploads/2022/07/%D8%AA%D8%AD%D8%B6%D9%8A%D8%B1-%D8%AA%D8%B1%D8%A8%D8%A9-%D8%A7%D9%84%D8%B0%D9%8F%D8%B1%D8%A9-%D9%88%D9%85%D8%AA%D8%B7%D9%84%D8%A8%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%B1%D8%A8%D8%A9-%D9%88%D8%A7%D9%84%D8%B2%D8%B1%D8%A7%D8%B9%D8%A9.jpg'
              width={500}
              height={500}
              style={{
                borderRadius: 15,
                width: '100%',
                maxHeight: 500,
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
              }}
              alt='تحضير التربة'
              className='shadow-lg'
            />
          </div>
          <div className='px-20 mx-5 text-right'>
            <p style={{ fontSize: 20 }}>
              تعد عملية تحضير الأرض قبل الزراعة خطوة حاسمة في نجاح المزروعات. فهي تسهم في
              إعداد البيئة المثلى لنمو النباتات، وتعزز امتصاص الأسمدة والماء، وتقلل من
              تواجه الأمراض والآفات. في هذا المقال، سنستعرض الخطوات الرئيسية والممارسات
              الفعّالة لتحضير الأرض قبل الزراعة.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>1. تحليل التربة</h3>
            <p style={{ fontSize: 20 }}>
              يعتبر تحليل التربة أول خطوة في تحضير الأرض. من خلال جمع عينات من التربة
              وتحليلها، يمكن تحديد نوعية التربة ومحتواها الغذائي ومستوى الحموضة. يتيح هذا
              التحليل للمزارعين ضبط التركيبة الغذائية المثلى وتعديل مستوى الحموضة إذا لزم
              الأمر.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>
              2. إزالة الحشائش والمخلفات
            </h3>
            <p style={{ fontSize: 20 }}>
              يجب إزالة الحشائش والمخلفات النباتية من سطح الأرض قبل البدء في تحضيرها.
              فالحشائش يمكن أن تنافس النباتات المزروعة على الموارد وتقلل من كفاءة
              الإنتاجية، بينما تقلل المخلفات من جودة التربة وتزيد من احتمال تواجد الآفات
              والأمراض.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>3. تنقيح الأرض</h3>
            <p style={{ fontSize: 20 }}>
              يتضمن تنقيح الأرض عدة عمليات مثل الحراثة والحراثة العميقة والتقليب. هذه
              العمليات تهدف إلى تحطيم التربة وتهويتها وتحسين تهويتها، مما يعزز تدفق الهواء
              والماء إلى جذور النباتات.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>4. إضافة المواد العضوية</h3>
            <p style={{ fontSize: 20 }}>
              تسهم المواد العضوية مثل السماد الطبيعي والسماد الأخضر في تغذية التربة وتحسين
              تركيبتها. يمكن خلط هذه المواد مع التربة أثناء تحضيرها أو وضعها في طبقات على
              سطح التربة للتحلل التدريجي.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>5. تسوية الأرض</h3>
            <p style={{ fontSize: 20 }}>
              يجب تسوية سطح الأرض بعناية بعد إجراء عمليات التحضير السابقة. يساهم ذلك في
              توزيع الرطوبة بشكل متساوٍ وتوفير سطح مستوٍ لزراعة البذور.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>
              6. إنشاء الأخاديد أو السراديب
            </h3>
            <p style={{ fontSize: 20 }}>
              قد تتطلب بعض المزروعات إنشاء أخاديد أو سراديب في التربة قبل زراعة البذور.
              يساهم ذلك في توفير بيئة مناسبة لزراعة البذور وتقليل فقدانها وزيادة فرص نجاح
              الزراعة.
            </p>
          </div>

          <Link className='mt-8 text-xl' href='/contact'>
            <Button variant={'pressable'} className='mt-10 mr-24'>
              طلب الخــدمة
            </Button>
          </Link>
        </div>
      </main>
    </Layout>
  )
}
