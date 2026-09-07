import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppSidebar } from "./app-sidebar";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";
import { useAuth } from "../context/authContext";

type MainLayoutProps = {
  children: ReactNode;
};

const NAV_ITEMS = [
  { path: "/dashboard", label: "Home" },
  { path: "/lab-reports", label: "Lab Reports" },
  { path: "/notes", label: "Notes" },
  { path: "/chatbot", label: "Assistant" },
];

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const activePath = location.pathname;

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar activePath={activePath} onNavigate={(path) => navigate(path)} />

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:opacity-80"
          >
            <Logo size="sm" />
          </button>

          <nav className="ml-6 hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activePath === item.path
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto">
            <UserMenu
              user={user}
              loading={loading}
              onSignIn={() => navigate("/login")}
              onSignOut={handleSignOut}
            />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
