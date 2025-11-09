import { useLocation } from 'react-router-dom';
import useDeviceDetection from '../hooks/useDeviceDetection';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNavbar from './mobile/MobileNavbar';
import MobileFooter from './mobile/MobileFooter';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isMobile } = useDeviceDetection();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      {isMobile ? <MobileNavbar /> : <Navbar />}
      {children}
      {isMobile ? <MobileFooter /> : <Footer />}
    </>
  );
};

export default Layout;


