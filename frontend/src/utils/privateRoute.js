import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function PrivateRoute({ children }) {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  } else {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    const expirationTime = decodedToken.exp;
    const currentTime = Date.now() / 1000;
    if (expirationTime < currentTime) {
      return <Navigate to="/" replace />;
    }
  }
  return children;
}
