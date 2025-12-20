import * as React from "react";
import { cn } from "../../lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800",
        className
      )}
      {...props}
    />
  );
}
