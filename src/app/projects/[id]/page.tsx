import { API_URL } from '@/data/constants'
import type { ProjectProps } from '@/types'
import axios from 'axios'

export default async function ProjectDetailsPage({
  params: { id: projectId }
}: {
  params: { id: string }
}) {
  const {
    data: { project }
  }: { data: { project: ProjectProps } } = await axios.get(
    `${API_URL}/projects/${projectId}`
  )

  // طباعة الـ project اللي جاي من الـ API
  console.log(project)

  /**
   * شكل الـ project اللي جاي من الـ API
   * {
   *     shms_project_id: 'f0496215-6d45-44b3-82fe-7753bc438a9e',
   *     shms_project_images: '[{"imgDisplayName":"Buy-Groundnut-wholesale-in-Nigeria.webp-SHMS-f0496215-6d45-44b3-82fe-7753bc438a9e","imgDisplayPath":"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/f0496215-6d45-44b3-82fe-7753bc438a9e/Buy-Groundnut-wholesale-in-Nigeria.webp-SHMS-f0496215-6d45-44b3-82fe-7753bc438a9e"},{"imgDisplayName":"download.jpg-SHMS-f0496215-6d45-44b3-82fe-7753bc438a9e","imgDisplayPath":"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/f0496215-6d45-44b3-82fe-7753bc438a9e/download.jpg-SHMS-f0496215-6d45-44b3-82fe-7753bc438a9e"},{"imgDisplayName":"food-624600_1920-1024x679.jpg-SHMS-f0496215-6d45-44b3-82fe-7753bc438a9e","imgDisplayPath":"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/f0496215-6d45-44b3-82fe-7753bc438a9e/food-624600_1920-1024x679.jpg-SHMS-f0496215-6d45-44b3-82fe-7753bc438a9e"},{"imgDisplayName":"images.jpg-SHMS-f0496215-6d45-44b3-82fe-7753bc438a9e","imgDisplayPath":"https://shms-uploads.s3.eu-west-2.amazonaws.com/projects/f0496215-6d45-44b3-82fe-7753bc438a9e/images.jpg-SHMS-f0496215-6d45-44b3-82fe-7753bc438a9e"}]',
   *     shms_project_name: 'مشروع زراعة الفول السوداني',
   *     shms_project_location: 'ولاية الأبيض',
   *     shms_project_start_date: '2024-05-31T23:00:00.000Z',
   *     shms_project_end_date: '2024-10-30T00:00:00.000Z',
   *     shms_project_invest_date: '2024-04-29T23:00:00.000Z',
   *     shms_project_stock_price: 2500,
   *     shms_project_stock_profits: 500,
   *     shms_project_description: 'مشروع زراعة الفول السوداني\n' +
   *       '\n' +
   *       'يشمل مشروع زراعة الفول السوداني في ولاية الأبيض بالسودان زراعة المحصول في فالية عالية، مما يعزز إنتاجية الفول. يتسم المشروع بالاهتمام بتحسين الزراعة وتعزيز التنمية المحلية، مع التركيز على الاستدامة واستخدام تقنيات حديثة.',
   *     shms_project_status: 'pending'
   *   }
   **/

  //  صور المشروع اللي جاية من الـ API محتاجة تتحول من string إلى array

  // JSON.parse(project.shms_project_images).map((image: string, index: number) => {
  //   console.log(image)
  // })
  // أو ممكن نرجعها كده
  // return (
  //   <img
  //     key={index}
  //     src={image.imgDisplayPath}
  //     alt={image.imgDisplayName}
  //   />
  // )

  return (
    <main className='flex flex-col items-center justify-between min-h-screen sm:p-24'>
      <h1> تفاصيل المشروع </h1>
      مشروع رقم {projectId}
    </main>
  )
}
