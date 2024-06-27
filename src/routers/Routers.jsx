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
import SurveyForm from "../pages/Common/SurveyForm";
import VerifyPayment from "../pages/Common/VerifyPayment";
import Dashboard from "../pages/CommonManager/Dashboard";
import ManageUser from "../pages/CommonManager/ManageUser";
import ManagementEvent from "../pages/CommonManager/ManagementEvent";
import CheckInModal from "../pages/Orgainization/CheckinModal";
import QuestionSurvey from "../pages/Orgainization/QuestionSurvey";
import SurveyModal from "../pages/Orgainization/SurveyModal";
import CheckInPage from "../pages/PM/CheckInPage";
import CreateEventForm from "../pages/PM/CreateEventForm";
import ManageTaskEvent from "../pages/PM/Task/ManageTaskEvent";
import ViewTask from "../pages/PM/Task/ViewTask";
import UpdateEventForm from "../pages/PM/UpdateEventForm";
import AddSponsorForm from "../pages/Sponsor/AddSponsorForm";
import AddSponsorMoney from "../pages/Sponsor/AddSponsorMoney";
import SponsorHistory from "../pages/Sponsor/SponsorHistory";
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
        { index: true, element: <Home /> },
        { path: "login", element: <LoginPage /> },
        { path: "verify-payment/*", element: <VerifyPayment /> },
        { path: "check-in", element: <CheckInPage /> },
        { path: "event/:id", element: <EventDetail /> },
        { path: "cart", element: <Cart /> },
        { path: "personal-information", element: <PersonalInformation /> },
        { path: "survey", element: <SurveyForm /> },
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
          path: "event",
          element: <ManagementEvent />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "surveys",
          element: <SurveyModal />,
        },
        {
          path: "create-survey",
          element: <QuestionSurvey />,
        },
        { path: "event/manage-check-in/:id", element: <CheckInModal /> },
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
          path: "event/update-event/:id",
          element: <UpdateEventForm />,
        },
        {
          path: "task",
          element: <ViewTask />,
        },
        {
          path: "task-asign",
          element: <ManageTaskEvent />,
        },
      ],
    },
  ]);
  return routing;
}
export default Routers;
