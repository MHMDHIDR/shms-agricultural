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
    </>
  )
}
