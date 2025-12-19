import React from "react";
import { useLocation } from "react-router-dom";
import { MainLayout } from "@/components/main-layout";

type ConditionalLayoutProps = {
  children: React.ReactNode;
};

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { pathname } = useLocation();

  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
