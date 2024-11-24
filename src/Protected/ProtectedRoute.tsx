import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): any {
  const { user, loading } = useAuth();
  if (loading) {
    return <div></div>;
  }

  return user ? children : <Navigate to="/" />;
}
