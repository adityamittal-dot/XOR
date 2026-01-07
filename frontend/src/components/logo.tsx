<<<<<<< HEAD
import React from "react";
import { cn } from "@/lib/utils";
=======
import { cn } from "../lib/utils";
>>>>>>> origin/frontend

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

<<<<<<< HEAD
/**
 * MedVault logo component (UI-only).
 * Scales icon and text consistently based on size prop.
 */
=======
>>>>>>> origin/frontend
export function Logo({
  className,
  size = "md",
  showText = true,
}: LogoProps) {
<<<<<<< HEAD
  const sizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
=======
  const sizeClasses = {
>>>>>>> origin/frontend
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

<<<<<<< HEAD
  const textSizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
=======
  const textSizeClasses = {
>>>>>>> origin/frontend
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex items-center justify-center">
        <svg
<<<<<<< HEAD
          className={cn(sizeClasses[size], "text-foreground")}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Heart outline */}
=======
          className={cn(sizeClasses[size], "text-gray-900")}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Heart */}
>>>>>>> origin/frontend
          <path
            d="M18 30C18 30 6 21 6 12C6 7.5 9.5 4 14 4C15.5 4 16.8 4.6 18 5.4C19.2 4.6 20.5 4 22 4C26.5 4 30 7.5 30 12C30 21 18 30 18 30Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
<<<<<<< HEAD
          />
=======
            fill="none"
          />

>>>>>>> origin/frontend
          {/* Medical cross */}
          <path
            d="M18 11V19M14 15H22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className={cn(
<<<<<<< HEAD
            "font-semibold tracking-tight text-foreground",
=======
            "font-semibold tracking-tight text-blue-800",
>>>>>>> origin/frontend
            textSizeClasses[size]
          )}
        >
          MedVault
        </span>
      )}
    </div>
  );
}
