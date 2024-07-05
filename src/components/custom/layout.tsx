import Footer from '@/components/custom/footer'
import Nav from '@/components/navigation/nav'

/**
 * Client Layout to wrap all pages with Nav
 * @returns {JSX.Element}
 */
export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <Nav />
      {children}
      <Footer />
      <div className='bottom-0 h-6 w-full text-white bg-red-600 fixed py-6 font-bold text-xl'>
        <p className='text-center'>Development Mode</p>
      </div>
    </>
  )
}
