import React from "react";
import {
  Home,
  Banknote,
  FileText,
  Package,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function AdminSidebar() {
  const location = useLocation();

  const items = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manajemen Produk",
      url: "/admin/products",
      icon: Package,
    },
    {
      title: "Transaksi",
      url: "/admin/transactions",
      icon: Banknote,
    },
    {
      title: "Pelanggan",
      url: "/admin/customers",
      icon: Users,
    },
    {
      title: "Laporan",
      url: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "Notifikasi",
      url: "/admin/notifications",
      icon: Bell,
    },
  ];

  return (
    <Sidebar className="bg-white border-r border-gray-100">
      <SidebarContent className="p-4">
        <SidebarGroup>
          <div className="px-3 py-4">
            <div className="flex items-center gap-3 mb-1">
              <Package className="w-8 h-8 text-blue-500" />
              <SidebarGroupLabel className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Toko Lion
              </SidebarGroupLabel>
            </div>
            <p className="text-sm text-gray-500 ml-11">Administrator Panel</p>
          </div>

          <Separator className="my-4" />

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-3">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`w-full group relative p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50 text-gray-600 "
                      }`}
                    >
                      <Link to={item.url} className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isActive ? "bg-blue-100" : "bg-gray-100 "
                          }`}
                        >
                          <item.icon
                            className={`w-5 h-5 ${
                              isActive ? "text-blue-600" : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.title}</span>
                            <ChevronRight
                              className={`w-4 h-4 transition-transform ${
                                isActive
                                  ? "transform translate-x-1"
                                  : "opacity-100"
                              }`}
                            />
                          </div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600">Admin Active</p>
            <p className="text-xs text-gray-500 mt-1">Administrator</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}