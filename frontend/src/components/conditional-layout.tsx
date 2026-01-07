<<<<<<< HEAD
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

=======
import { ReactNode } from "react";
import { MainLayout } from "./main-layout";

type ConditionalLayoutProps = {
  children: ReactNode;
  isAuthPage?: boolean;
};

export function ConditionalLayout({
  children,
  isAuthPage = false,
}: ConditionalLayoutProps) {
>>>>>>> origin/frontend
  if (isAuthPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
