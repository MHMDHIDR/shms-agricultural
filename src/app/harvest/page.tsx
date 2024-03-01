import Layout from '@/components/custom/Layout'
import { Button } from '@/components/ui/button'
import { APP_DESCRIPTION, APP_TITLE } from '@/data/constants'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `الحصـــــــــاد | ${APP_TITLE}
}`,
  description: APP_DESCRIPTION
}

export default function Harvest() {
  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen'>
        <h1 className='mb-2 mt-10 text-2xl'>موسم الحصاد</h1>

        <div dir='rtl' style={{ marginTop: 10, justifyContent: 'center' }}>
          <div style={{ margin: 50, display: 'flex', justifyContent: 'center' }}>
            <Image
              src='https://banassa.info/wp-content/uploads/2020/09/1-117.jpg'
              width={500}
              height={500}
              style={{
                borderRadius: 15,
                width: '100%',
                maxHeight: 500,
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)'
              }}
              alt='موسم الحصاد'
              className='shadow-lg'
            />
          </div>
          <div className='text-right mx-5 px-20'>
            <p style={{ fontSize: 20 }}>
              يعتبر الحصاد إحدى المراحل الحاسمة في عملية الزراعة، حيث يتم فيها جني
              المحاصيل الناضجة وجمعها بعد جهد وعناء عملية الزراعة. يشمل الحصاد عدة خطوات
              وتقنيات يجب مراعاتها لضمان الحصول على محاصيل ذات جودة عالية وإتمام عملية
              الإنتاج بنجاح. في هذا المقال، سنستعرض الخطوات الأساسية والتقنيات الفعّالة
              لمرحلة الحصاد.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>
              1. تحديد موعد الحصاد المناسب
            </h3>
            <p style={{ fontSize: 20 }}>
              يعتمد موعد الحصاد على نوع المحصول وظروف الطقس والمناخ. يجب تحديد موعد الحصاد
              بعناية لضمان نضج المحاصيل بشكل كامل وتجنب جنيها قبل أو بعد الوقت المناسب.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>
              2. استخدام الأدوات والمعدات المناسبة
            </h3>
            <p style={{ fontSize: 20 }}>
              يجب استخدام الأدوات والمعدات المناسبة لكل نوع من المحاصيل المزروعة. من ضمن
              هذه الأدوات: المناجل، الحصّادات الآلية، وأدوات القطاف المخصصة لبعض الثمار.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>3. جني المحاصيل بعناية</h3>
            <p style={{ fontSize: 20 }}>
              يجب جني المحاصيل بعناية لضمان عدم تلفها أو فقدها. يجب التحكم في سرعة العمل
              وتوجيه الأدوات بحذر لتجنب الإصابة بالمحاصيل القريبة غير الناضجة.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>4. التخزين السليم</h3>
            <p style={{ fontSize: 20 }}>
              بعد الحصاد، يجب تخزين المحاصيل بطريقة تحافظ على جودتها وتمنع تلفها. يجب
              مراعاة الظروف المناخية المناسبة لكل نوع من المحاصيل وتوفير التهوية والرطوبة
              المناسبة.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>5. التجهيز للتسويق</h3>
            <p style={{ fontSize: 20 }}>
              يجب التجهيز لعملية التسويق للمحاصيل بعد الحصاد، بما في ذلك تحضير العبوات
              اللازمة وتوفير وسائل النقل اللازمة لنقل المحاصيل إلى الأسواق.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>6. الحفاظ على السلامة</h3>
            <p style={{ fontSize: 20 }}>
              يجب الحرص على السلامة خلال عملية الحصاد، بما في ذلك استخدام الأدوات بحذر
              واتباع إجراءات السلامة المعتمدة.
            </p>
            <h3 style={{ fontSize: 30, fontWeight: 'bold' }}>7. الاستفادة من المخلفات</h3>
            <p style={{ fontSize: 20 }}>
              يمكن استخدام المخلفات الناتجة عن عملية الحصاد في عدة طرق مفيدة، مثل تحويلها
              إلى سماد عضوي أو استخدامها في إنتاج الطاقة البيولوجية.
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
