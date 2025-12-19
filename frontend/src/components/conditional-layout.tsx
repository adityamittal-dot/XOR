import React from "react";
import { useLocation } from "react-router-dom";
import { MainLayout } from "@/components/main-layout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const location = useLocation();

  // auth routes (later)
  const isAuthPage = location.pathname.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
