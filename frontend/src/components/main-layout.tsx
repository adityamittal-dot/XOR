import React from "react";
import { NavLink } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "@/components/user-menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout.
 * Wraps pages with sidebar, header, and navigation.
 * UI-only version (no Next.js, no backend assumptions).
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Logo / Home link */}
          <NavLink to="/" className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-blue-600 hidden sm:inline">
              MedVault
            </span>
          </NavLink>

          {/* Top navigation */}
          <nav className="flex items-center gap-1 ml-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
                  : "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/lab-reports"
              className={({ isActive }) =>
                isActive
                  ? "px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
                  : "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              Overview
            </NavLink>
          </nav>

          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 overflow-auto bg-gray-50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
