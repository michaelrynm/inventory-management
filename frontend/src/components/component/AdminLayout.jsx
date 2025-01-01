import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar.jsx";
export default function AdminLayout({ children }) {
  return (
    <div>
      <SidebarProvider>
        <AdminSidebar />
        <main className="p-10 w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
