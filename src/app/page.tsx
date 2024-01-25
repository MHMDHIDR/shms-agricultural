import Layout from '@/components/custom/Layout'
import Slider from '@/components/custom/Slider'

export default function Home() {
  // get images from backend api (uploaded to dashboard by admin stored in AWS S3)
  const images = [
    'https://source.unsplash.com/featured/?plants',
    'https://source.unsplash.com/featured/?nature',
    'https://source.unsplash.com/featured/?flowers',
    'https://source.unsplash.com/featured/?plants',
    'https://source.unsplash.com/featured/?apples',
    'https://source.unsplash.com/featured/?berries',
    'https://source.unsplash.com/featured/?oranges',
    'https://source.unsplash.com/featured/?penuts',
    'https://source.unsplash.com/featured/?trees',
    'https://source.unsplash.com/featured/?palms'
  ]

  return (
    <Layout>
      <Slider images={images} />
      <section className='flex min-h-screen flex-col items-center justify-between p-24'>
        <h1>مرحباً بكم في شمــس</h1>
      </section>
    </Layout>
  )
}
