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
  );
}
