import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
<<<<<<< HEAD
import { cn } from "@/lib/utils";

function TooltipProvider(
  props: React.ComponentProps<typeof TooltipPrimitive.Provider>
) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={0}
      {...props}
    />
  );
}

function Tooltip(
  props: React.ComponentProps<typeof TooltipPrimitive.Root>
) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      {...props}
    />
  );
}

function TooltipContent({
  className,
  sideOffset = 4,
=======
import { cn } from "../../lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 6,
>>>>>>> origin/frontend
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
<<<<<<< HEAD
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md",
=======
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-md",
>>>>>>> origin/frontend
          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
<<<<<<< HEAD

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
};
=======
>>>>>>> origin/frontend
