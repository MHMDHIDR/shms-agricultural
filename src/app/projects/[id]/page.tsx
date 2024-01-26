export default function Deteals({ params: { id } }: { params: { id: string } }) {
  return (
    <main className='flex flex-col items-center justify-between min-h-screen sm:p-24'>
      <h1> تفاصيل المشروع </h1>
      مشروع رقم {id}
    </main>
  )
}
