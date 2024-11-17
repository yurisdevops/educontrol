// routes.tsx
import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { LoginTeacher } from "../Pages/Login/LoginTeacher";
import { Layout } from "../Components/Layout";
import { ProfileTeacher } from "../Pages/Profile/ProfileTeacher";
import { Dashboard } from "../Pages/Dashboard";
import { Class } from "../Pages/Dashboard/Class";
import { ProtectedRoute } from "../Protected/ProtectedRoute";
import { ProfileInformation } from "../Pages/Profile/ProfileInformation";
import { LoginInstitution } from "../Pages/Login/LoginInstitution";
import { RegisterInstitution } from "../Pages/Register/RegisterInstitution";
import { ProfileInstituion } from "../Pages/Profile/ProfileInstitution";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/loginTeacher",
    element: <LoginTeacher />,
  },
  {
    path: "/loginInstitution",
    element: <LoginInstitution />,
  },
  {
    path: "/registerInstitution",
    element: <RegisterInstitution />,
  },

  {
    element: <Layout />,
    children: [
      {
        path: "/profileTeacher",
        element: (
          <ProtectedRoute>
            <ProfileTeacher />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (
          <ProtectedRoute>
            <ProfileInformation />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/class/:uid",
        element: (
          <ProtectedRoute>
            <Class />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profileInstitution",
        element: (
          <ProtectedRoute>
            <ProfileInstituion />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default route;
