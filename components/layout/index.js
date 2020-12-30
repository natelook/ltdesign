import Nav from './Nav';
import Footer from './Footer';

export default function Layout({ children, pathname }) {
  return (
    <div>
      <Nav pathname={pathname} />
      {pathname !== '/' && <div style={{ height: '80px', opacity: 0 }} />}
      {children}
    </div>
  );
}
