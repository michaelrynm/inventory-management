import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserSidebar from "./UserSidebar.jsx";

export default function UserLayout({ children }) {
  return (
    <div>
      <SidebarProvider>
        <UserSidebar />
        <main className="p-10 w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
