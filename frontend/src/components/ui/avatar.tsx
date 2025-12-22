import * as React from "react";
import { cn } from "../../lib/utils";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement>;

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    />
  );
}

export type AvatarImageProps =
  React.ImgHTMLAttributes<HTMLImageElement>;

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <img
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export type AvatarFallbackProps =
  React.HTMLAttributes<HTMLSpanElement>;

export function AvatarFallback({
  className,
  ...props
}: AvatarFallbackProps) {
  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-700",
        className
      )}
      {...props}
    />
  );
}
