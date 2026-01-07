import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
<<<<<<< HEAD
import { cn } from "@/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
=======
import { cn } from "../../lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({
>>>>>>> origin/frontend
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
<<<<<<< HEAD
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-9 items-center rounded-lg bg-muted p-1",
=======
      className={cn(
        "inline-flex rounded-md border border-gray-200 bg-gray-100 p-1",
>>>>>>> origin/frontend
        className
      )}
      {...props}
    />
  );
}

<<<<<<< HEAD
function TabsTrigger({
=======
export function TabsTrigger({
>>>>>>> origin/frontend
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
<<<<<<< HEAD
      data-slot="tabs-trigger"
      className={cn(
        "rounded-md px-3 py-1 text-sm font-medium transition data-[state=active]:bg-background",
=======
      className={cn(
        "px-3 py-1.5 text-sm font-medium rounded-sm transition-colors",
        "data-[state=active]:bg-white data-[state=active]:shadow-sm",
        "hover:bg-gray-200",
>>>>>>> origin/frontend
        className
      )}
      {...props}
    />
  );
}

<<<<<<< HEAD
function TabsContent({
=======
export function TabsContent({
>>>>>>> origin/frontend
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
<<<<<<< HEAD
      data-slot="tabs-content"
      className={cn("outline-none", className)}
=======
      className={cn("mt-4", className)}
>>>>>>> origin/frontend
      {...props}
    />
  );
}
<<<<<<< HEAD

export { Tabs, TabsList, TabsTrigger, TabsContent };
=======
>>>>>>> origin/frontend
