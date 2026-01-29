import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "./app-sidebar";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = location.pathname;

  function onNavigate(path: string) {
    navigate(path);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar activePath={activePath} onNavigate={onNavigate} />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4">
          <button onClick={() => navigate("/dashboard")} className="hover:opacity-80">
            <Logo size="sm" />
          </button>

          {/* Top navigation */}
          <nav className="ml-6 hidden sm:flex items-center gap-1">
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activePath === "/dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => navigate("/lab-reports")}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activePath === "/lab-reports"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
          </nav>

          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
