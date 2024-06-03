import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import ErrorPage from "../pages/Common/ErrorPage";
import LoginPage from "../pages/Common/LoginPage";
import VerifyPayment from "../pages/Common/VerifyPayment";
import CheckInPage from "../pages/PM/CheckInPage";
import SponsorModal from "../pages/Sponsor/SponsorModal";
import ProtectedRouteAdmin from "./PrivateRoute/ProtectedRouteAdmin";
function Routers() {
  const routing = useRoutes([
    {
      path: "*",
      element: <ErrorPage />,
    },
    {
      path: "/",
      element: <CommonLayout />,
      children: [
        { index: true, element: <div>a</div> },
        { path: "login", element: <LoginPage /> },
        { path: "verify-payment/*", element: <VerifyPayment /> },
        { path: "check-in", element: <CheckInPage /> },
      ],
    },
    {
      path: "/sponsor/",
      element: <CommonLayout />,
      children: [{ path: "dashboard", element: <SponsorModal /> }],
    },
    {
      path: "admin",
      element: (
        <ProtectedRouteAdmin>
          <ManagementLayOut />
        </ProtectedRouteAdmin>
      ),
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        {
          path: "dashboard",
          element: <div>Dashboard</div>,
        },
      ],
    },
    // //sponsor
    // {
    //   path: "sponsor",
    //   element: (
    //     <ProtectedRouteAdmin>
    //       <ManagementLayOut />
    //     </ProtectedRouteAdmin>
    //   ),
    //   children: [
    //     { index: true, element: <Navigate to="dashboard" replace /> },
    //     {
    //       path: "dashboard",
    //     },
    //   ],
    // },
  ]);
  return routing;
}
export default Routers;
