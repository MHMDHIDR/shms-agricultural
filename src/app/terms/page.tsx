import Layout from '@/components/custom/Layout'
import Link from 'next/link'
import { APP_DESCRIPTION, APP_TITLE } from '@/data/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'شروط الاستخدام | ' + APP_TITLE,
  description: APP_DESCRIPTION
}

export default function TermsPage() {
  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen p-24 rtl'>
        <h1 className='text-xl font-bold select-none'>الشروط والأحكام</h1>
        <section className='leading-loose text-justify'>
          <h2 className='text-lg font-semibold mt-4'>مقدمة</h2>
          <p>
            مرحبًا بك في صفحة الشروط والأحكام لشركة شمس الزراعية. يرجى قراءة هذه الشروط
            والأحكام بعناية قبل استخدام خدماتنا.
          </p>
          <h2 className='text-lg font-semibold mt-4'>الموافقة على الشروط والأحكام</h2>
          <p>
            باستخدام خدماتنا، فإنك توافق على الالتزام بشروط وأحكامنا. إذا كنت لا توافق على
            هذه الشروط والأحكام، فيرجى عدم استخدام خدماتنا.
          </p>
          <h2 className='text-lg font-semibold mt-4'>الاستخدام الصحيح</h2>
          <p>
            يجب على المستخدمين استخدام خدماتنا بطريقة صحيحة ومناسبة ووفقًا للقوانين
            واللوائح المعمول بها. يجب عدم استخدام الخدمات لأغراض غير قانونية أو غير
            أخلاقية.
          </p>
          <h2 className='text-lg font-semibold mt-4'>التعديلات على الشروط والأحكام</h2>
          <p>
            نحتفظ بالحق في تعديل أو تحديث هذه الشروط والأحكام في أي وقت دون إشعار مسبق.
            يجب على المستخدمين مراجعة هذه الشروط بشكل دوري للبقاء على اطلاع على التغييرات.
          </p>
          <h2 className='text-lg font-semibold mt-4'>المسؤوليات والضمانات</h2>
          <p>
            نحن لا نقدم أي ضمانات بشأن دقة أو اكتمال المعلومات المقدمة عبر خدماتنا. على
            المستخدمين تقديم المعلومات الصحيحة والموثوقة وتحديثها عند الضرورة.
          </p>
          <h2 className='text-lg font-semibold mt-4'>التواصل</h2>
          <p>
            لأية استفسارات أو مخاوف بشأن هذه الشروط والأحكام، يرجى الاتصال بنا عبر البريد
            الإلكتروني على{' '}
            <Link
              href='mailto:info@shmsagricultural.com'
              className='mx-3 text-blue-500 underline-hover hover:text-blue-700'
            >
              info@shmsagricultural.com.
            </Link>
          </p>
          <h2 className='text-lg font-semibold mt-4'>التسوية للنزاعات</h2>
          <p>
            في حالة وجود أي نزاع بين المستخدم والشركة، يتعين على الطرفين أولاً محاولة
            التوصل إلى تسوية ودية. إذا فشلت التسوية الودية، يتم التحكيم وفقًا لقوانين
            التحكيم المعمول بها.
          </p>
          <h2 className='text-lg font-semibold mt-4'>التنازل عن المسؤولية</h2>
          <p>
            نحن لا نتحمل أي مسؤولية عن الأضرار المباشرة أو غير المباشرة أو العرضية أو
            الناتجة عن استخدامك لخدماتنا أو عدم قدرتك على الوصول إليها.
          </p>
          <h2 className='text-lg font-semibold mt-4'>حقوق الملكية الفكرية</h2>
          <p>
            جميع حقوق الملكية الفكرية للمحتوى المعروض عبر خدماتنا تنتمي إلى شركة شمس
            الزراعية. يجب عدم نسخ أو توزيع أو استخدام أي جزء من المحتوى دون الحصول على إذن
            مسبق.
          </p>
          <h2 className='text-lg font-semibold mt-4'>سرية المعلومات</h2>
          <p>
            نحترم سرية المعلومات الشخصية للمستخدمين ونلتزم بحمايتها وعدم مشاركتها مع أطراف
            ثالثة دون الحصول على إذن صريح.
          </p>
          <h2 className='text-lg font-semibold mt-4'>التنفيذ</h2>
          <p>
            تعتبر هذه الشروط والأحكام جزءًا لا يتجزأ من اتفاقية استخدام خدماتنا. يجب على
            المستخدمين الالتزام بهذه الشروط والأحكام أثناء استخدام خدماتنا.
          </p>
          <h2 className='text-lg font-semibold mt-4'>تحديد المسؤولية</h2>
          <p>
            نحتفظ بالحق في تحديد المسؤولية والتعويض في حالة انتهاك هذه الشروط والأحكام.
          </p>
          <h2 className='text-lg font-semibold mt-4'>التنصل من المسؤولية</h2>
          <p>نحتفظ بالحق في تغيير أو تعديل أو إنهاء خدماتنا في أي وقت دون إشعار مسبق.</p>
          <h2 className='text-lg font-semibold mt-4'>القانون الساري</h2>
          <p>
            يخضع استخدامك لخدماتنا للقوانين واللوائح المعمول بها في البلدان التي نقدم فيها
            خدماتنا.
          </p>
          <h2 className='text-lg font-semibold mt-4'>تغيير الاتفاقية</h2>
          <p>
            نحتفظ بالحق في تعديل أو تغيير هذه الشروط والأحكام في أي وقت دون إشعار مسبق.
          </p>
          <h2 className='text-lg font-semibold mt-4'>التواصل</h2>
          <p>
            لأية استفسارات أو مخاوف بشأن هذه الشروط والأحكام، يرجى الاتصال بنا عبر البريد
            الإلكتروني على{' '}
            <Link
              href='mailto:info@shmsagricultural.com'
              className='mx-3 text-blue-500 underline-hover hover:text-blue-700'
            >
              info@shmsagricultural.com.
            </Link>
          </p>
        </section>
      </main>
    </Layout>
  )
}
