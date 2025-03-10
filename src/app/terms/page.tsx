import Link from "next/link"
import { ADMIN_EMAIL, APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `شروط الإستخدام | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export const dynamic = "force-static"

export default function TermsPage() {
  return (
    <main className="rtl flex min-h-screen flex-col justify-between p-2.5 pt-10 md:p-16">
      <h1 className="text-xl font-bold select-none text-center">الشروط والأحكام</h1>
      <section className="text-justify leading-loose">
        <h2 className="mt-4 text-lg font-semibold">مقدمة</h2>
        <p>
          مرحبًا بك في صفحة الشروط والأحكام لشركة شمس الزراعية. يرجى قراءة هذه الشروط والأحكام
          بعناية قبل استخدام خدماتنا.
        </p>
        <h2 className="mt-4 text-lg font-semibold">الموافقة على الشروط والأحكام</h2>
        <p>
          باستخدام خدماتنا، فإنك توافق على الالتزام بشروط وأحكامنا. إذا كنت لا توافق على هذه الشروط
          والأحكام، فيرجى عدم استخدام خدماتنا.
        </p>
        <h2 className="mt-4 text-lg font-semibold">الاستخدام الصحيح</h2>
        <p>
          يجب على المستخدمين استخدام خدماتنا بطريقة صحيحة ومناسبة ووفقًا للقوانين واللوائح المعمول
          بها. يجب عدم استخدام الخدمات لأغراض غير قانونية أو غير أخلاقية.
        </p>
        <h2 className="mt-4 text-lg font-semibold">التعديلات على الشروط والأحكام</h2>
        <p>
          نحتفظ بالحق في تعديل أو تحديث هذه الشروط والأحكام في أي وقت دون إشعار مسبق. يجب على
          المستخدمين مراجعة هذه الشروط بشكل دوري للبقاء على اطلاع على التغييرات.
        </p>
        <h2 className="mt-4 text-lg font-semibold">المسؤوليات والضمانات</h2>
        <p>
          نحن لا نقدم أي ضمانات بشأن دقة أو اكتمال المعلومات المقدمة عبر خدماتنا. على المستخدمين
          تقديم المعلومات الصحيحة والموثوقة وتحديثها عند الضرورة.
        </p>
        <h2 className="mt-4 text-lg font-semibold">التواصل</h2>
        <p>
          لأية استفسارات أو مخاوف بشأن هذه الشروط والأحكام، يرجى الاتصال بنا عبر البريد الإلكتروني
          على{" "}
          <Link
            href={`mailto:${ADMIN_EMAIL}`}
            className="underline-hover mx-3 text-blue-500 hover:text-blue-700"
          >
            {ADMIN_EMAIL}.
          </Link>
        </p>
        <h2 className="mt-4 text-lg font-semibold">التسوية للنزاعات</h2>
        <p>
          في حالة وجود أي نزاع بين المستخدم والشركة، يتعين على الطرفين أولاً محاولة التوصل إلى تسوية
          ودية. إذا فشلت التسوية الودية، يتم التحكيم وفقًا لقوانين التحكيم المعمول بها.
        </p>
        <h2 className="mt-4 text-lg font-semibold">التنازل عن المسؤولية</h2>
        <p>
          نحن لا نتحمل أي مسؤولية عن الأضرار المباشرة أو غير المباشرة أو العرضية أو الناتجة عن
          استخدامك لخدماتنا أو عدم قدرتك على الوصول إليها.
        </p>
        <h2 className="mt-4 text-lg font-semibold">حقوق الملكية الفكرية</h2>
        <p>
          جميع حقوق الملكية الفكرية للمحتوى المعروض عبر خدماتنا تنتمي إلى شركة شمس الزراعية. يجب عدم
          نسخ أو توزيع أو استخدام أي جزء من المحتوى دون الحصول على إذن مسبق.
        </p>
        <h2 className="mt-4 text-lg font-semibold">سرية المعلومات</h2>
        <p>
          نحترم سرية المعلومات الشخصية للمستخدمين ونلتزم بحمايتها وعدم مشاركتها مع أطراف ثالثة دون
          الحصول على إذن صريح.
        </p>
        <h2 className="mt-4 text-lg font-semibold">التنفيذ</h2>
        <p>
          تعتبر هذه الشروط والأحكام جزءًا لا يتجزأ من اتفاقية استخدام خدماتنا. يجب على المستخدمين
          الالتزام بهذه الشروط والأحكام أثناء استخدام خدماتنا.
        </p>
        <h2 className="mt-4 text-lg font-semibold">تحديد المسؤولية</h2>
        <p>نحتفظ بالحق في تحديد المسؤولية والتعويض في حالة انتهاك هذه الشروط والأحكام.</p>
        <h2 className="mt-4 text-lg font-semibold">التنصل من المسؤولية</h2>
        <p>نحتفظ بالحق في تغيير أو تعديل أو إنهاء خدماتنا في أي وقت دون إشعار مسبق.</p>
        <h2 className="mt-4 text-lg font-semibold">القانون الساري</h2>
        <p>
          يخضع استخدامك لخدماتنا للقوانين واللوائح المعمول بها في البلدان التي نقدم فيها خدماتنا.
        </p>
        <h2 className="mt-4 text-lg font-semibold">تغيير الاتفاقية</h2>
        <p>نحتفظ بالحق في تعديل أو تغيير هذه الشروط والأحكام في أي وقت دون إشعار مسبق.</p>
        <h2 className="mt-4 text-lg font-semibold">التواصل</h2>
        <p>
          لأية استفسارات أو مخاوف بشأن هذه الشروط والأحكام، يرجى الاتصال بنا عبر البريد الإلكتروني
          على{" "}
          <Link
            href={`mailto:${ADMIN_EMAIL}`}
            className="underline-hover mx-3 text-blue-500 hover:text-blue-700"
          >
            {ADMIN_EMAIL}
          </Link>
        </p>
      </section>
    </main>
  )
}
