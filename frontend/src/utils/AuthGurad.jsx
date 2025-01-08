import { Navigate, useLocation } from "react-router-dom";

export const AuthGuard = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to login page with the return url
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
