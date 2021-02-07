import Nav from './Nav'
import Footer from './Footer'

export default function Layout({ children, pathname }) {
  return (
    <div>
      <Nav pathname={pathname} />
      {pathname !== '/' && <div className='filler' />}
      {children}
      <Footer />
    </div>
  )
}
