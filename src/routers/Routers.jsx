import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import ErrorPage from "../pages/Common/ErrorPage";
import LoginPage from "../pages/Common/LoginPage";
import VerifyPayment from "../pages/Common/VerifyPayment";
import CheckInPage from "../pages/PM/CheckInPage";
<<<<<<< HEAD
import SponsorModal from "../pages/Sponsor/SponsorModal";
import ProtectedRouteAdmin from "./PrivateRoute/ProtectedRouteAdmin";
=======
import CreateEventForm from "../pages/PM/CreateEventForm";
import Home from "../pages/Common/Home";
import EventDetail from "../pages/Common/Event/EventDetail";
import Cart from "../pages/Common/Cart";

>>>>>>> 85c18ab7b06a32b8543f1d8db19a1f32c907def7
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

        {
          path: "users",
          element: <div>Users</div>,
        },
        {
          path: "settings",
          element: <div>Settings</div>,
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
