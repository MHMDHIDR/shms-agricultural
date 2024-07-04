import Footer from '@/components/custom/Footer'
import Nav from '@/components/navigation/Nav'

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
    </>
  )
}
