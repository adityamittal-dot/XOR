import { ReactNode } from "react";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

type SidebarProps = {
  children: ReactNode;
};

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-64 border-r border-gray-200 bg-white">
      <ScrollArea className="h-screen w-full p-4">
        {children}
      </ScrollArea>
    </aside>
  );
}

type MobileSidebarProps = {
  children: ReactNode;
};

export function MobileSidebar({ children }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden bg-transparent hover:bg-gray-100">
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <ScrollArea className="h-full p-4">
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
