import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

<<<<<<< HEAD
/**
 * Merge Tailwind + conditional class names
 */
=======
>>>>>>> origin/frontend
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
