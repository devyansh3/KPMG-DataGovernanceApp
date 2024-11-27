import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";

import PrivateRoute from "./privateRoute";
import AccomodationLayout from "../pages/accomodation/AccomodationLayout";
import TestPrepLayout from "../pages/TestPrep/Layout";
import FinanceLayout from "../Layouts/FinanceLayout";
import LayoutPageDestination from "../Layouts/DestinationLayout";
import AdminLayout from "../Layouts/AdminLayout";
import Teams from "../pages/admin/Teams";
import Onboarding from "../pages/admin/Onboarding";
import NurtureLeads from "../pages/admin/NurtureLeads";
import StudentsTable from "../pages/admin/StudentsTable";
import ManageLeadsTable from "../pages/admin/ManageLeadsTable";
import HomeLayout from "../Components/Home";
import LayoutBlogs from "../Components/LayoutBlogs";

const AppRoutes = () => {
  // Define all routes (public and private)
  const allRoutes = [
    { path: "/", element: <HomeLayout />, isPrivate: false },
    {
      path: "/destinations",
      element: <LayoutPageDestination />,
      isPrivate: false,
    },
    { path: "/testprep", element: <TestPrepLayout />, isPrivate: false },
    { path: "/blog", element: <LayoutBlogs />, isPrivate: false },
    { path: "/finance", element: <FinanceLayout />, isPrivate: false },
    {
      path: "/accomodation",
      element: <AccomodationLayout />,
      isPrivate: false,
    },

    // Admin Dashboard Routes (Private)
    {
      path: "/admin",
      element: <AdminLayout />,
      isPrivate: true,
      requiredRole: "admin",
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "teams", element: <Teams /> },
        { path: "nurtureLeads", element: <NurtureLeads /> },
        { path: "students", element: <StudentsTable /> },
        { path: "leads", element: <ManageLeadsTable /> },
      ],
    },
  ];

  return (
    <Routes>
      {/* Loop through the routes and apply PrivateRoute for private routes */}
      {allRoutes.map(({ path, element, isPrivate, children }, index) => (
        <Route
          key={index}
          path={path}
          element={
            isPrivate ? (
              <PrivateRoute>{element}</PrivateRoute> // Wrap private routes in PrivateRoute
            ) : (
              element // Render public routes directly
            )
          }
        >
          {/* Render child routes */}
          {children &&
            children.map((child, idx) => (
              <Route key={idx} path={child.path} element={child.element} />
            ))}
        </Route>
      ))}

      {/* Fallback for unknown routes (optional) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
