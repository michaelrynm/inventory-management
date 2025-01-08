import { Navigate, useLocation } from "react-router-dom";

export const RoleGuard = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Admin can access all routes
  if (role === "ADMIN") {
    return children;
  }

  // Check if user role is allowed
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RoleGuard;
