import Layout from '@/components/custom/Layout'

export default function AboutPage() {
  return (
    <Layout>
      <main className='flex flex-col justify-between min-h-screen p-24 rtl'>
        <h1 className='text-xl text-center underline-hover w-fit mx-auto'>
          نبذة عن منصة شمس
        </h1>

        <h2 className='mt-8 text-lg text-right font-bold underline underline-offset-4'>
          رؤيتنا:
        </h2>
        <p className='text-xl leading-10'>
          رؤيتنا في منصة شمس الزراعية هي أن نصبح الرائدة في مجال توفير الخدمات الزراعية
          الاستثمارية بالمساهمة وتحقيق الاستدامة البيئية والاقتصادية في القطاع الزراعي.
        </p>

        <h2 className='mt-8 text-lg text-right font-bold underline underline-offset-4'>
          أهدافنا:
        </h2>
        <p className='text-xl leading-10'>
          تسعى منصة شمس لتحقيق عدة أهداف، منها دعم المزارعين والمستثمرين في القطاع
          الزراعي، وتعزيز البنية التحتية الزراعية، وتطوير التكنولوجيا المستخدمة في الزراعة
          لتحقيق أفضل العوائد.
        </p>

        <h2 className='mt-8 text-lg text-right font-bold underline underline-offset-4'>
          قيمنا:
        </h2>
        <p className='text-xl leading-10'>
          تقوم منصة شمس على عدة قيم، منها الشفافية والنزاهة في التعاملات، والاحترافية في
          تقديم الخدمات، والابتكار والتطوير المستمر لتحسين الأداء وتلبية احتياجات العملاء
          بشكل مستمر.
        </p>
      </main>
    </Layout>
  )
}
