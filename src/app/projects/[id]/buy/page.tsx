import { CardWrapper } from '@/components/auth/card-wrapper'
import Layout from '@/components/custom/Layout'
import { API_URL } from '@/data/constants'
import { ProjectProps } from '@/types'
import axios from 'axios'

export default async function BuyStocks({
  params: { id: projectId }
}: {
  params: { id: string }
}) {
  const {
    data: { project }
  }: { data: { project: ProjectProps } } = await axios.get(
    `${API_URL}/projects/get/${projectId}`
  )

  return (
    <Layout>
      <section className='pt-20 container rtl min-h-screen'>
        {/* كل شخص يستطيع شراء عدد من الأسهم على حسب الحد المسموح به في user.shms_user_stock_limit */}

        <CardWrapper className='md:w-[50rem] mx-auto' heading={'صفحة شراء أسهم'}>
          <form className='container w-full min-w-max' dir='rtl'>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  قيمة السهم الواحد
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='text'
                  value={project.shms_project_stock_price}
                  disabled
                />
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  عدد الأسهم
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='text'
                  placeholder='عدد الأسهم'
                />
              </div>
            </div>
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  عدد الأسهم
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='text'
                  placeholder='عدد الأسهم'
                />
              </div>
            </div>
          </form>
        </CardWrapper>
      </section>
    </Layout>
  )
}
