import axios from 'axios'
import { API_URL } from '@/data/constants'
import type { ProjectProps } from '@/types'

export default async function ProjectDetailsPage({
  params: { id }
}: {
  params: { id: string }
}) {
  const {
    data: { project }
  }: { data: { project: ProjectProps } } = await axios.get(`${API_URL}/projects/${id}`)

  return (
    <main className='flex flex-col items-center justify-between min-h-screen sm:p-24'>
      <h1> تفاصيل المشروع </h1>
      مشروع رقم {id}
    </main>
  )
}
