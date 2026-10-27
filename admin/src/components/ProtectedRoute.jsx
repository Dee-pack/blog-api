import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user || user.role !== "AUTHOR") {
    return <Navigate to="/login" replace />;
  }

  return children;
}