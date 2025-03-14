import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Register from "@/pages/Register.jsx";
import AuthGuard from "@/utils/AuthGurad.jsx";
import RoleGuard from "@/utils/RoleGuard.jsx";
import Landing from "@/pages/Landing.jsx";
import LoginUser from "@/pages/User/LoginUser.jsx";
import Transaksi from "@/pages/User/Transaksi.jsx";
import DataTransaksi from "@/pages/User/DataTransaksi.jsx";

import LoginAdmin from "@/pages/Admin/LoginAdmin.jsx";
import Dashboard from "@/pages/Admin/Dashboard.jsx";
import ProductManagement from "@/pages/Admin/ProductManagement.jsx";
import TransactionManagement from "@/pages/Admin/TransactionManagement.jsx";
import CustomerManagement from "@/pages/Admin/CustomerManagement.jsx";
import ReportPage from "@/pages/Admin/LaporanPage.jsx";
import NotificationPage from "@/pages/Admin/NotificationPage.jsx";
import ManageUSer from "@/pages/Admin/AddUser.jsx";
import Expenses from "@/pages/Admin/Expenses.jsx";
import LandingPage from "@/pages/LandingPage.jsx";
export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/landing",
      element: <Landing />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/user/login",
      element: <LoginUser />,
    },
    {
      path: "/admin/login",
      element: <LoginAdmin />,
    },
    // Protected User Routes
    {
      path: "/user/Transaksi",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["KASIR", "ADMIN"]}>
            <Transaksi />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "/user/DataTransaksi",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["KASIR", "ADMIN"]}>
            <DataTransaksi />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    // Protected Admin Routes
    {
      path: "/admin/dashboard",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["ADMIN"]}>
            <Dashboard />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "/admin/products",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["ADMIN"]}>
            <ProductManagement />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "/admin/transactions",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["ADMIN"]}>
            <TransactionManagement />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "/admin/expenses",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["ADMIN"]}>
            <Expenses />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "/admin/customers",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["ADMIN"]}>
            <CustomerManagement />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "/admin/reports",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["ADMIN"]}>
            <ReportPage />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "/admin/notifications",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["ADMIN"]}>
            <NotificationPage />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "/admin/manageuser",
      element: (
        <AuthGuard>
          <RoleGuard allowedRoles={["ADMIN"]}>
            <ManageUSer />
          </RoleGuard>
        </AuthGuard>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/user/login" />,
    },
  ]);
  return <RouterProvider router={router} />;
}
