import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollTop from "../components/common/ScrollTop";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <ScrollTop />

      <Footer />
    </>
  );
}

export default MainLayout;