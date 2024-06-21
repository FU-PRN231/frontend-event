import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import Cart from "../pages/Common/Cart";
import ErrorPage from "../pages/Common/ErrorPage";
import EventDetail from "../pages/Common/Event/EventDetail";
import Home from "../pages/Common/Home";
import LoginPage from "../pages/Common/LoginPage";
import VerifyPayment from "../pages/Common/VerifyPayment";
import SurveyModal from "../pages/Orgainization/SurveyModal";
import CheckInPage from "../pages/PM/CheckInPage";
import CreateEventForm from "../pages/PM/CreateEventForm";
import SponsorModal from "../pages/Sponsor/SponsorModal";
import ProtectedRouteAdmin from "./PrivateRoute/ProtectedRouteAdmin";
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
      path: "/sponsor/",
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
          path: "manage-user",
          element: <ManageUser />,
        },
      ],
    },
    {
      path: "organization",
      // element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="surveys" replace /> },
        {
          path: "surveys",
          element: <SurveyModal />,
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
