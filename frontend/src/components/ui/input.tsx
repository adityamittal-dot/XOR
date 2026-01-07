import * as React from "react";
<<<<<<< HEAD
import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-ring",
=======
import { cn } from "../../lib/utils";

export type InputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
>>>>>>> origin/frontend
        className
      )}
      {...props}
    />
  );
}
<<<<<<< HEAD

export { Input };
=======
>>>>>>> origin/frontend
