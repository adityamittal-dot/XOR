import { ReactNode, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const [activePath, setActivePath] = useState("/");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (desktop + mobile handled inside AppSidebar) */}
      <AppSidebar
        activePath={activePath}
        onNavigate={setActivePath}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4">
          <Logo size="sm" />

          {/* Top navigation */}
          <nav className="ml-6 hidden sm:flex items-center gap-1">
            <button
              onClick={() => setActivePath("/")}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activePath === "/"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActivePath("/lab-reports")}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activePath === "/lab-reports"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
          </nav>

          {/* User menu */}
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
