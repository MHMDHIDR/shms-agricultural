import Layout from '@/components/custom/layout'
import Link from 'next/link'
import { APP_DESCRIPTION, APP_TITLE } from '@/data/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة استخدام ملفات تعريف الارتباط | ' + APP_TITLE,
  description: APP_DESCRIPTION
}

export default function CookiesPolicyPage() {
  return (
    <Layout>
      <main className='flex flex-col justify-start min-h-screen p-24 rtl'>
        <h1 className='text-xl font-bold select-none'>
          سياسة استخدام ملفات تعريف الارتباط
        </h1>
        <section className='mt-10 leading-loose md:text-justify'>
          <p>مرحبًا بك في سياسة استخدام ملفات تعريف الارتباط لموقعنا.</p>
          <p>تستخدم هذه السياسة ملفات تعريف الارتباط لتحسين تجربتك أثناء تصفح الموقع.</p>
          <p>سيتم تخزين معلومات محددة على جهازك لتمكين الوصول إلى ميزات معينة.</p>
          <p>
            من خلال استخدام موقعنا، فإنك توافق على استخدام ملفات تعريف الارتباط وفقًا
            لسياسة الخصوصية الخاصة بنا.
          </p>
          <p>
            نحن نحترم خصوصيتك ونضمن أمان بياناتك الشخصية وفقًا للوائح والتشريعات السارية.
          </p>
          <p>
            لمزيد من المعلومات حول كيفية استخدامنا لملفات تعريف الارتباط، يرجى قراءة سياسة
            الخصوصية الخاصة بنا.
          </p>
          <p>شكرًا لاختيارك استخدام موقعنا!</p>
          <p>
            يمكنك العثور على مزيد من المعلومات حول سياسة ملفات تعريف الارتباط في الوصلة
            التالية:{' '}
            <Link
              className='text-blue-500 hover:underline'
              target='_blank'
              href='https://en.wikipedia.org/wiki/HTTP_cookie'
            >
              سياسة ملفات تعريف الارتباط
            </Link>
          </p>
        </section>
      </main>
    </Layout>
  )
}
