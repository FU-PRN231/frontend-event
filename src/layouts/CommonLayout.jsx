import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

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
