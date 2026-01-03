import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  StickyNote,
  LayoutDashboard,
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
  SidebarHeader,
} from "@/components/ui/sidebar";

/**
 * Sidebar navigation items
 * (UI-only, backend-agnostic)
 */
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Lab Reports",
    icon: FileText,
    href: "/lab-reports",
  },
  {
    title: "AI Chatbot",
    icon: MessageSquare,
    href: "/chatbot",
  },
  {
    title: "Notes",
    icon: StickyNote,
    href: "/notes",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <NavLink
          to="/"
          className="hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          
          <span className="font-semibold text-blue-600">MedVault</span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.href} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
