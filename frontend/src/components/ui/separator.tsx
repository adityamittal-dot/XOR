import * as React from "react";
<<<<<<< HEAD
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
=======
import { cn } from "../../lib/utils";

export type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      className={cn(
        "bg-gray-200",
        orientation === "horizontal"
          ? "h-px w-full"
          : "h-full w-px",
>>>>>>> origin/frontend
        className
      )}
      {...props}
    />
  );
}
<<<<<<< HEAD

export { Separator };
=======
>>>>>>> origin/frontend
