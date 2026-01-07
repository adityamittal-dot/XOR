import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
<<<<<<< HEAD
import { cn } from "@/lib/utils";

function ScrollArea({
=======
import { cn } from "../../lib/utils";

export function ScrollArea({
>>>>>>> origin/frontend
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
<<<<<<< HEAD
    <ScrollAreaPrimitive.Root className={cn("relative", className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" />
=======
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
>>>>>>> origin/frontend
    </ScrollAreaPrimitive.Root>
  );
}

<<<<<<< HEAD
export { ScrollArea };
=======
export function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      orientation={orientation}
      className={cn(
        "flex touch-none select-none bg-gray-100 p-0.5",
        orientation === "vertical" && "h-full w-2",
        orientation === "horizontal" && "h-2 w-full",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-gray-400" />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
>>>>>>> origin/frontend
