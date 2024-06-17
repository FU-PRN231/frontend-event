import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import LoginPage from "../pages/Common/LoginPage";
import ErrorPage from "../pages/Common/ErrorPage";
import VerifyPayment from "../pages/Common/VerifyPayment";
import ProtectedRouteAdmin from "./PrivateRoute/ProtectedRouteAdmin";
import CheckInPage from "../pages/PM/CheckInPage";
import CreateEventForm from "../pages/PM/CreateEventForm";
import Home from "../pages/Common/Home";
import EventDetail from "../pages/Common/Event/EventDetail";
import Cart from "../pages/Common/Cart";
import PersonalInformation from "../pages/Common/PersonalInformation";
import ManageUser from "../pages/CommonManager/ManageUser";

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
        { index: true, element: <Home /> },
        { path: "login", element: <LoginPage /> },
        { path: "verify-payment/*", element: <VerifyPayment /> },
        { path: "check-in", element: <CheckInPage /> },
        { path: "event/:id", element: <EventDetail /> },
        { path: "cart", element: <Cart /> },
        { path: "personal-information", element: <PersonalInformation /> },
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
          element: <div>Dashboard</div>,
        },

        {
          path: "manage-user",
          element: <ManageUser />,
        },
      ],
    },
    {
      path: "pm",
      element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="create-event" replace /> },
        {
          path: "create-event",
          element: <CreateEventForm />,
        },
      ],
    },
  ]);
  return routing;
}
export default Routers;
