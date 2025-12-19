import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      {...props}
    />
  );
}

export { Input };
