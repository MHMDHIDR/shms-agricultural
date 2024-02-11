import Layout from '@/components/custom/Layout'
import { NavigateTop } from '@/components/custom/NavigateTop'
import { APP_DESCRIPTION, APP_TITLE } from '@/data/constants'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | ' + APP_TITLE,
  description: APP_DESCRIPTION
}

export default function PrivacyPage() {
  return (
    <Layout>
      <main className='flex flex-col min-h-screen px-5 pt-20 rtl gap-y-10'>
        <h1 className='text-xl font-bold select-none'>سياسة الخصوصية</h1>
        <section className='leading-loose md:text-justify'>
          <h2 className='text-sm text-gray-600 font-semibold'>
            آخر تحديث في 6 فبراير 2024
          </h2>
          <p>
            توضح هذه السياسة لشركة شمس الزراعية (&apos;نحن&apos;، &apos;نحن&apos;، أو
            &apos;لنا&apos;) كيف ولماذا قد نقوم بجمع وتخزين واستخدام و / أو مشاركة
            (&apos;معالجة&apos;) معلوماتك عند استخدام خدماتنا (&apos;الخدمات&apos;)، مثل
            عندما تقوم:
          </p>
          <ul className='list-disc list-inside'>
            <li>
              بزيارة موقعنا على الويب على الرابط
              <Link
                href='/'
                className='mx-3 text-blue-500 underline-hover hover:text-blue-700'
              >
                shmsagricultural.com
              </Link>
              أو أي رابط ويب لدينا يرتبط بهذه السياسة الخصوصية
            </li>
            <li>تفاعلك معنا بطرق أخرى ذات صلة، بما في ذلك أي مبيعات أو تسويق أو أحداث</li>
          </ul>
          <p>
            لديك أسئلة؟ قراءت لهذه السياسة ستساعدك على فهم خياراتك بشأن الخصوصية. إذا لم
            تكن متفقًا مع سياساتنا وممارساتنا، يرجى عدم استخدام خدماتنا. إذا كان لديك لا
            تزال أي أسئلة أو استفسارات يرجى الاتصال بنا على
            <Link
              href='mailto:info@shmsagricultural.com'
              className='mx-3 text-blue-500 underline-hover hover:text-blue-700'
            >
              info@shmsagricultural.com.
            </Link>
          </p>
          <h3 className='text-lg font-semibold mt-4'>ملخص للنقاط الرئيسية</h3>
          <p>
            توفر هذه السلسلة المفاتيح الرئيسية من إشعار الخصوصية الخاص بنا، ولكن يمكنك
            العثور على مزيد من التفاصيل حول أي من هذه الموضوعات عن طريق النقر على الرابط
            بعد كل نقطة رئيسية أو باستخدام جدول المحتويات الخاص بنا أدناه للعثور على القسم
            الذي تبحث عنه.
          </p>
          <ol className='list-decimal list-inside text-blue-700 underline underline-offset-4 md:no-underline'>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-1'
              >
                ما هي المعلومات الشخصية التي نقوم بمعالجتها؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-2'
              >
                كيف نقوم بمعالجة معلوماتك؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-3'
              >
                متى ومع من نشارك معلوماتك الشخصية؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-4'
              >
                هل نستخدم ملفات تعريف الارتباط وغيرها من تقنيات التتبع؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-5'
              >
                ما هو مدى الوقت الذي نحتفظ فيه بمعلوماتك؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-6'
              >
                كيف نحافظ على سلامة معلوماتك؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-7'
              >
                هل نجمع معلومات من القصر؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-8'
              >
                ما هي حقوق الخصوصية لديك؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-9'
              >
                تحكمات لميزة عدم التتبع
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-10'
              >
                هل نقوم بتحديثات لهذا الإشعار؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-11'
              >
                كيف يمكنك الاتصال بنا حول هذا الإشعار؟
              </Link>
            </li>
            <li>
              <Link
                className='md:underline-hover md:before:bg-blue-500'
                href='#section-12'
              >
                كيف يمكنك مراجعة أو تحديث أو حذف البيانات التي نجمعها منك؟
              </Link>
            </li>
          </ol>
          <h2 id='section-1' className='text-lg font-semibold mt-4 scroll-mt-24'>
            1. ما هي المعلومات الشخصية التي نقوم بجمعها؟
          </h2>
          <p>المعلومات الشخصية التي تكشفها لنا</p>
          <p>في القصير: نقوم بجمع المعلومات الشخصية التي تقدمها لنا بإرادتك.</p>
          <p>
            نجمع المعلومات الشخصية التي تقدمها بإرادتك عندما تسجل في الخدمات، أو تعبر عن
            اهتمامك في الحصول على معلومات عنا أو منتجاتنا وخدماتنا، عندما تشارك في الأنشطة
            على الخدمات، أو في غيرها عندما تتصل بنا.
          </p>
          <p>
            المعلومات الشخصية المقدمة من قبلك. المعلومات الشخصية التي نجمعها تعتمد على
            سياق تفاعلك معنا ومع الخدمات، والخيارات التي تقوم بها، والمنتجات والميزات التي
            تستخدمها. قد تشمل المعلومات الشخصية التي نجمعها ما يلي:
          </p>
          <ul className='list-disc list-inside'>
            <li>الأسماء</li>
            <li>عناوين البريد الإلكتروني</li>
            <li>أرقام الهواتف</li>
            <li>كلمات المرور</li>
            <li>عناوين الفواتير</li>
            <li>الجنسية</li>
          </ul>
          <p>
            المعلومات الحساسة. عند الضرورة، بموافقتك أو كما يسمح به القانون الساري، نعالج
            الفئات الحساسة التالية من المعلومات:
          </p>
          <ul className='list-disc list-inside'>
            <li>جواز السفر أو وثيقة الهوية</li>
          </ul>
          <p>
            يجب أن تكون جميع المعلومات الشخصية التي تقدمها لنا صحيحة، كاملة، ودقيقة، ويجب
            أن تُعلمنا بأي تغييرات في مثل هذه المعلومات الشخصية.
          </p>
          <h2 id='section-2' className='text-lg font-semibold mt-4 scroll-mt-24'>
            2. كيف نقوم بمعالجة معلوماتك؟
          </h2>
          <p>
            باختصار: نقوم بمعالجة معلوماتك لتوفير، وتحسين، وإدارة خدماتنا، والتواصل معك،
            وللأمان ومنع الاحتيال، والامتثال للقانون. قد نقوم أيضًا بمعالجة معلوماتك
            لأغراض أخرى بموافقتك.
          </p>
          <p>
            نقوم بمعالجة معلوماتك الشخصية لأسباب متنوعة، اعتمادًا على كيفية تفاعلك مع
            خدماتنا، بما في ذلك:
          </p>
          <ul className='list-disc list-inside'>
            <li>لتسهيل إنشاء الحساب والمصادقة وإدارة حسابات المستخدمين بشكل عام</li>
            <li>لتقديم الخدمات المطلوبة للمستخدم</li>
            <li>لإرسال المعلومات الإدارية لك</li>
            <li>لتحقيق وتحسين خدماتنا ومنتجاتنا وتسويقنا وتجربتك</li>
          </ul>
          <h2 id='section-3' className='text-lg font-semibold mt-4 scroll-mt-24'>
            3. متى ومع من نشارك معلوماتك الشخصية؟
          </h2>
          <p>باختصار: قد نشارك المعلومات في حالات محددة ومع أطراف معينة.</p>
          <p>قد نحتاج إلى مشاركة معلوماتك الشخصية في الحالات التالية:</p>
          <ul className='list-disc list-inside'>
            <li>
              نقل الأعمال. قد نشارك أو ننقل معلوماتك في إطار أو أثناء المفاوضات لأي
              اندماج، أو بيع لأصول الشركة، أو تمويل، أو الاستحواذ على كامل أو جزء من
              أعمالنا إلى شركة أخرى.
            </li>
          </ul>
          <h2 id='section-4' className='text-lg font-semibold mt-4 scroll-mt-24'>
            4. هل نستخدم ملفات تعريف الارتباط وغيرها من تقنيات التتبع؟
          </h2>
          <p>
            باختصار: قد نستخدم ملفات تعريف الارتباط وتقنيات تتبع أخرى لجمع وتخزين
            معلوماتك.
          </p>
          <p>
            قد نستخدم ملفات تعريف الارتباط وتقنيات تتبع مماثلة (مثل الشعارات الويب
            والبكسل) للوصول إلى معلوماتك أو تخزينها. يتم تحديد معلومات محددة حول كيفية
            استخدامنا لمثل هذه التقنيات وكيف يمكنك رفض بعض ملفات تعريف الارتباط في إشعار
            ملف تعريف الارتباط الخاص بنا:
            <Link
              href='/cookies-policy'
              className='mx-3 text-blue-500 underline-hover hover:text-blue-700'
            >
              https://shmsagricultural.com/cookies-policy.
            </Link>
          </p>
          <h2 id='section-5' className='text-lg font-semibold mt-4 scroll-mt-24'>
            5. ما هو مدى الوقت الذي نحتفظ فيه بمعلوماتك؟
          </h2>
          <p>
            باختصار: نحتفظ بمعلوماتك للمدة اللازمة لتحقيق الأغراض المحددة في هذا الإشعار
            الخصوصية ما لم يقتضي الأمر خلاف ذلك بالقانون.
          </p>
          <p>
            سنحتفظ بمعلوماتك الشخصية فقط للمدة اللازمة لتحقيق الأغراض المحددة في هذا
            الإشعار الخصوصية، ما لم تتطلب فترة الاحتفاظ الطويلة الأمر أو يسمح به القانون
            (مثل الضرائب، أو المحاسبة، أو المتطلبات القانونية الأخرى). لا يتطلب أي من
            الأغراض المذكورة في هذا الإشعار أن نحتفظ بمعلوماتك الشخصية لمدة أطول من الفترة
            التي يكون فيها المستخدمون لديهم حساب معنا.
          </p>
          <p>
            عندما لا تكون لدينا حاجة تجارية مشروعة مستمرة لمعالجة معلوماتك الشخصية، فإما
            أن نقوم بحذف أو تجهيز تلك المعلومات، أو إذا لم يكن هذا ممكنًا (على سبيل
            المثال، لأن معلوماتك الشخصية قد تم تخزينها في نسخ احتياطية)، فإننا سنقوم
            بتخزين معلوماتك الشخصية بشكل آمن وعزلها عن أي معالجة مستقبلية حتى يكون الحذف
            ممكنًا.
          </p>
          <h2 id='section-6' className='text-lg font-semibold mt-4 scroll-mt-24'>
            6. كيف نحافظ على سلامة معلوماتك؟
          </h2>
          <p>
            باختصار: نهدف إلى حماية معلوماتك الشخصية من خلال نظام من الإجراءات الأمنية
            التنظيمية والتقنية.
          </p>
          <p>
            لقد قمنا بتنفيذ تدابير أمنية تقنية وتنظيمية مناسبة ومعقولة مصممة لحماية أمان
            أي معلومات شخصية نقوم بمعالجتها. ومع ذلك، على الرغم من الإجراءات الأمنية
            والجهود التي بذلناها لتأمين معلوماتك، لا يمكن ضمان أو وعد بأن عمليات النقل
            الإلكترونية عبر الإنترنت أو تكنولوجيا تخزين المعلومات يمكن أن تكون مضمونة
            بنسبة 100% للأمان، لذلك لا يمكننا أو نعدك بأن المتسللين أو الجرائم الإلكترونية
            أو أطراف ثالثة غير مصرح بها سيكونون قادرين على هزيمة أماننا وجمع معلوماتك بشكل
            غير ملائم، أو الوصول إليها، أو سرقتها، أو تعديلها. على الرغم من أننا سنبذل
            قصارى جهدنا لحماية معلوماتك الشخصية، فإن نقل المعلومات الشخصية إلى ومن خدماتنا
            هو على مسؤوليتك الخاصة. يجب عليك فقط الوصول إلى الخدمات داخل بيئة آمنة.
          </p>
          <h2 id='section-7' className='text-lg font-semibold mt-4 scroll-mt-24'>
            7. هل نجمع معلومات من القصر؟
          </h2>
          <p>باختصار: لا نقوم بجمع البيانات من القصر بصورة معلمة.</p>
          <p>باستخدامك لهذا الموقع / تطبيق الويب. فأنت توافق على أنك أكبر من سن 18 سنة</p>
          <h2 id='section-8' className='text-lg font-semibold mt-4 scroll-mt-24'>
            8. ما هي حقوق الخصوصية لديك؟
          </h2>
          <p>باختصار: يمكنك مراجعة أو تغيير أو إنهاء حسابك في أي وقت.</p>
          <p>
            سحب موافقتك. يمكنك في أي وقت سحب موافقتك على معالجة معلوماتك الشخصية دون أن
            تؤثر على شرعية أي معالجة تمت قبل سحب موافقتك.
          </p>
          <p>
            الوصول إلى حسابك. إذا كنت تمتلك حسابًا على هذا الموقع / التطبيق، فيمكنك طلب
            نسخة من المعلومات الشخصية التي نحتفظ بها عنك.
          </p>
          <h2 id='section-9' className='text-lg font-semibold mt-4 scroll-mt-24'>
            9. تحكمات لميزة عدم التتبع
          </h2>
          <p>باختصار: لا يتبع هذا الموقع / التطبيق أو يستجيب لإشارات عدم التتبع.</p>
          <p>
            يمكنك تحديد هل ترغب في تلقي ملفات تعريف الارتباط عبر إعدادات متصفح الويب الخاص
            بك. إذا قمت بتعطيل ملفات تعريف الارتباط، قد لا تتمكن من استخدام كل ميزات
            الموقع / التطبيق.
          </p>
          <h2 id='section-10' className='text-lg font-semibold mt-4 scroll-mt-24'>
            10. هل نقوم بتحديثات لهذا الإشعار؟
          </h2>
          <p>
            باختصار: نعم، قد نقوم بتحديث هذا الإشعار بمرور الوقت. يُعرض أي تغيير كبير في
            هذا الإشعار على الرئيسية لموقع الويب الخاص بنا.
          </p>
          <p>
            نحتفظ بالحق في تغيير هذا الإشعار بأي وقت، وتعتبر التغييرات فعالة عندما يتم
            نشرها على الويب. سيتم إعلامك عادة بأي تغييرات كبيرة لهذا الإشعار، سواءً عن
            طريق إعلان موضوعي على موقع الويب الخاص بنا، أو عن طريق إرسال إشعار لك عبر
            البريد الإلكتروني.
          </p>
          <h2 id='section-11' className='text-lg font-semibold mt-4 scroll-mt-24'>
            11. كيف يمكنك الاتصال بنا حول هذا الإشعار؟
          </h2>
          <p>
            إذا كان لديك أسئلة أو تعليقات حول هذا الإشعار، أو كانت لديك مخاوف بشأن
            الخصوصية، يرجى الاتصال بنا عن طريق البريد الإلكتروني على
            <Link
              href='mailto:info@shmsagricultural.com'
              className='mx-3 text-blue-500 underline-hover hover:text-blue-700'
            >
              info@shmsagricultural.com.
            </Link>
          </p>
          <h2 id='section-12' className='text-lg font-semibold mt-4 scroll-mt-24'>
            12. كيف يمكنك مراجعة أو تحديث أو حذف البيانات التي نجمعها منك؟
          </h2>
          <p>باختصار: تحديد خيارات الحساب في حال كان لديك حساب.</p>
          <p>
            إذا كنت تمتلك حسابًا معنا، فيمكنك مراجعة وتحديث معلوماتك الشخصية بتسجيل الدخول
            إلى حسابك والتنقل إلى قسم الإعدادات الخاص بك. إذا كنت ترغب في حذف حسابك أو
            البيانات التي نحتفظ بها عنك، فيرجى الاتصال بنا عبر البريد الإلكتروني على
            <Link
              href='mailto:info@shmsagricultural.com'
              className='mx-3 text-blue-500 underline-hover hover:text-blue-700'
            >
              info@shmsagricultural.com.
            </Link>
          </p>
        </section>
        <NavigateTop />
      </main>
    </Layout>
  )
}
