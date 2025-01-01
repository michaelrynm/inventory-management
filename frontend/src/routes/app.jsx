import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LoginUser from "@/pages/User/LoginUser.jsx";
import Transaksi from "@/pages/User/Transaksi.jsx";
import DataTransaksi from "@/pages/User/DataTransaksi.jsx";
import Dashboard from "@/pages/Admin/Dashboard.jsx";
import ProductManagement from "@/pages/Admin/ProductManagement.jsx";
import TransactionManagement from "@/pages/Admin/TransactionManagement.jsx";
import CustomerManagement from "@/pages/Admin/CustomerManagement.jsx";
import ReportPage from "@/pages/Admin/LaporanPage.jsx";
import NotificationPage from "@/pages/Admin/NotificationPage.jsx";
export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/user/login",
      element: <LoginUser />,
    },
    {
      path: "/user/Transaksi",
      element: <Transaksi />,
    },
    {
      path: "/user/DataTransaksi",
      element: <DataTransaksi />,
    },
    {
      path: "/admin/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/admin/products",
      element: <ProductManagement />,
    },
    {
      path: "/admin/transactions",
      element: <TransactionManagement />,
    },
    {
      path: "/admin/customers",
      element: <CustomerManagement />,
    },
    {
      path: "/admin/reports",
      element: <ReportPage />,
    },
    {
      path: "/admin/notifications",
      element: <NotificationPage />,
    },
    {
      path: "*",
      element: <Navigate to="/user/login" />,
    }
  ]);
  return <RouterProvider router={router} />;
}
