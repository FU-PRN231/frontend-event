import { Outlet } from "react-router-dom";
import NavBar from "../components/Navbar/Navbar";
import Footer from "../components/footer/Footer";

const CommonLayout = () => {
  return (
    <>
      <NavBar />
      <div className="container my-10">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};
export default CommonLayout;
