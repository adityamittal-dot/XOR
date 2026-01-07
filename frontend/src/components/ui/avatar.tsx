import * as React from "react";
<<<<<<< HEAD
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
=======
import { cn } from "../../lib/utils";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement>;

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200",
>>>>>>> origin/frontend
        className
      )}
      {...props}
    />
  );
}

<<<<<<< HEAD
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
=======
export type AvatarImageProps =
  React.ImgHTMLAttributes<HTMLImageElement>;

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <img
      className={cn("h-full w-full object-cover", className)}
>>>>>>> origin/frontend
      {...props}
    />
  );
}

<<<<<<< HEAD
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
=======
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
>>>>>>> origin/frontend
        className
      )}
      {...props}
    />
  );
}
<<<<<<< HEAD

export { Avatar, AvatarImage, AvatarFallback };
=======
>>>>>>> origin/frontend
