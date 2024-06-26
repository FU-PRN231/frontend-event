import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import Cart from "../pages/Common/Cart";
import ErrorPage from "../pages/Common/ErrorPage";
import EventDetail from "../pages/Common/Event/EventDetail";
import Home from "../pages/Common/Home";
import LoginPage from "../pages/Common/LoginPage";
import PersonalInformation from "../pages/Common/PersonalInformation";
import VerifyPayment from "../pages/Common/VerifyPayment";
import ManageUser from "../pages/CommonManager/ManageUser";
import ManagementEvent from "../pages/CommonManager/ManagementEvent";
import CheckInModal from "../pages/Orgainization/CheckinModal";
import SurveyModal from "../pages/Orgainization/SurveyModal";
import CheckInPage from "../pages/PM/CheckInPage";
import CreateEventForm from "../pages/PM/CreateEventForm";
import TaskModal from "../pages/PM/TaskModal";
import AddSponsorForm from "../pages/Sponsor/AddSponsorForm";
import AddSponsorMoney from "../pages/Sponsor/AddSponsorMoney";
import SponsorHistory from "../pages/Sponsor/SponsorHistory";
import SponsorModal from "../pages/Sponsor/SponsorModal";
import ProtectedRouteAdmin from "./PrivateRoute/ProtectedRouteAdmin";
import Dashboard from "../pages/CommonManager/Dashboard";
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
      path: "/sponsor",
      element: <ManagementLayOut />,

      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },

        { path: "dashboard", element: <Dashboard /> },
        { path: "sponsor-money", element: <SponsorModal /> },
        { path: "history", element: <SponsorHistory /> },
        { path: "add-new", element: <AddSponsorForm /> },
        { path: "add-money-sponsor", element: <AddSponsorMoney /> },
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
          element: <Dashboard />,
        },

        {
          path: "manage-user",
          element: <ManageUser />,
        },
      ],
    },
    {
      path: "org",
      element: <ManagementLayOut />,

      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "surveys",
          element: <SurveyModal />,
        },
        { path: "manage-checkin", element: <CheckInModal /> },
      ],
    },

    {
      path: "pm",
      element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },

        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "event",
          element: <ManagementEvent />,
        },
        {
          path: "event/create-event",
          element: <CreateEventForm />,
        },
        {
          path: "task",
          element: <TaskModal />,
        },
      ],
    },
  ]);
  return routing;
}
export default Routers;
