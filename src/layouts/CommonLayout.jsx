import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/footer/Footer";

const CommonLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />

      <Footer />
    </>
  );
};
export default CommonLayout;
