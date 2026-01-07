<<<<<<< HEAD
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
=======
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  StickyNote,
} from "lucide-react";

import { Sidebar, MobileSidebar } from "./ui/sidebar";
import { Logo } from "./logo";

type AppSidebarProps = {
  activePath: string;
  onNavigate: (path: string) => void;
};

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Lab Reports", icon: FileText, path: "/lab-reports" },
  { label: "AI Chatbot", icon: MessageSquare, path: "/chatbot" },
  { label: "Notes", icon: StickyNote, path: "/notes" },
];

function SidebarContent({
  activePath,
  onNavigate,
}: AppSidebarProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <button
        onClick={() => onNavigate("/")}
        className="flex items-center gap-2 hover:opacity-80"
      >
        <Logo size="sm" />
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = activePath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function AppSidebar({
  activePath,
  onNavigate,
}: AppSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <Sidebar>
        <SidebarContent
          activePath={activePath}
          onNavigate={onNavigate}
        />
      </Sidebar>

      {/* Mobile sidebar */}
      <MobileSidebar>
        <SidebarContent
          activePath={activePath}
          onNavigate={onNavigate}
        />
      </MobileSidebar>
    </>
>>>>>>> origin/frontend
  );
}
