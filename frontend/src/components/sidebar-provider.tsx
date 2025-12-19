import React from "react";
import { SidebarProvider as UISidebarProvider } from "@/components/ui/sidebar";

interface SidebarProviderProps {
  children: React.ReactNode;
}

/**
 * App-level sidebar provider.
 * Thin wrapper around the UI SidebarProvider.
 */
export function SidebarProvider({ children }: SidebarProviderProps) {
  return <UISidebarProvider>{children}</UISidebarProvider>;
}
