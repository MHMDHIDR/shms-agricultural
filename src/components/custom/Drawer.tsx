import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

export default function MyDrawer({ children }: { children: React.ReactNode }) {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button type='button' variant={'outline'} className='mr-10'>
          {children}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className='text-right rtl'>
            <h4>تعليمات توضيحة كيفية استخدام الــMarkdown</h4>
          </DrawerTitle>
          <DrawerDescription className='container mt-4 overflow-y-auto text-right rtl leading-10 max-h-56'>
            <p>
              إنّ لغة ماركداون (Markdown) هي لغة وب تنسيقية. فبدلاً من الكتابة بلغة HTML
              يمكن الكتابة بهذه اللغة وهي أبسط بكثير من html وسهلة القراءة والكتابة،
              وبوجود مفسر فسيتم تحويل تنسيق markdown إلى html.
            </p>

            <p>
              يجب العلم بأن الكثير من المواقع التي نستخدمها تدعم تفسير تنسيق markdown،
              فيمكن استخدام هذه اللغة في ووردبريس ومشاريع أخرى، وطبعاً هي لغة أساسية في
              github.
            </p>

            <h5>كيفية التنسيق</h5>
            <p>
              والآن، لكي نتعلم هذه اللغة فكل ما علينا تعلمه هو بعض الأكواد التي تتضمنها
              اللغة. هنا حاولت جمع كل الأكواد المستخدمة في هذه اللغة (فهي ليست لغة ضخمة)
            </p>

            <p>
              النص العادي يكتب بدون الحاجة لأي أكواد. مع ملاحظة بسيطة هو أنك يجب أن تضع
              سطر فارغ بين الفقرة والأخرى لكي تُقرأ على أنها بداية سطر جديد. أي بدل الضغط
              على enter للانتقال للسطر الجديد ستضغط على enter مرتين لترك سطر فارغ وبالتالي
              ليفهم المفسر أنك تريد الانتقال لسطر جديد.
            </p>

            <h5>العناوين</h5>
            <p>
              لكتابة العنوان الرئيسي نستخدم الرمز # مرة واحدة أمام النص، وللعناوين الفرعية
              نستخدم عدد أكبر من الرموز # حسب الرتبة. مثال:
            </p>
            <pre># عنوان رئيسي ## عنوان فرعي 1 ### عنوان فرعي 2 #### عنوان فرعي 3</pre>

            <h5>الاقتباس</h5>
            <p>لكتابة نص مقتبس نستخدم الرمز {'>'} قبل النص المقتبس:</p>
            <pre>{'>'} هذا عبارة عن نص مقتبس</pre>

            <h5>نمط النص</h5>
            <p>
              لجعل بعض الكلمات تظهر بشكل عريض أو مائل نستخدم الرمز * أو الشرطة السفلية _
              قبل وبعد النص المراد تنسيقه:
            </p>
            <pre>هذه الكلمة مكتوبة بشكل **عريض** وهذه مكتوبة بشكل *مائل*</pre>

            <h5>القوائم</h5>
            <p>
              للقائمة المنقطة نستخدم الرمز * أو - قبل النص، وللقائمة المُرّقمة نستخدم
              الأرقام مع نقطة . قبل النص:
            </p>
            <pre>
              * عنصر قائمة
              <br />
              1. عنصر قائمة
              <br />
              2. عنصر قائمة
              <br />
              3. عنصر قائمة
              <br />
            </pre>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
