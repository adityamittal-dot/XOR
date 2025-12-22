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
  if (isAuthPage) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}
