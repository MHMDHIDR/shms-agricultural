export default function Deteals({ params: { id } }: { params: { id: string } }) {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24'>
      <h1> تفاصيل المشروع </h1>
      مشروع رقم {id}
    </main>
  )
}
