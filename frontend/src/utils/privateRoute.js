import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(UserContext);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
