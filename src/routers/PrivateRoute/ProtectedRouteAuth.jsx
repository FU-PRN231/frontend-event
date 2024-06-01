import { Navigate } from "react-router-dom";
import { decode } from "../../utils/jwtUtil";

const ProtectedRouteAuth = ({ children }) => {
  const role = decode(localStorage.getItem("accessToken"));
  if (role !== "isStaff" && role != "isAdmin") {
    alertFail("Bạn cần phải đăng nhập để thực hiện thao tác này!!");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRouteAuth;
//
