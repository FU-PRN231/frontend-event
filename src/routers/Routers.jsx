import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import ErrorPage from "../pages/Common/ErrorPage";
import LoginPage from "../pages/Common/LoginPage";
import VerifyPayment from "../pages/Common/VerifyPayment";
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
      ],
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
          element: <ProtectedRouteAdmin></ProtectedRouteAdmin>,
        },
      ],
    },
  ]);
  return routing;
}
export default Routers;
