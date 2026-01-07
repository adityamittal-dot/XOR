<<<<<<< HEAD
import React, { useState } from "react";
=======
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
>>>>>>> origin/frontend
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
<<<<<<< HEAD
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";

/**
 * UI-only User Menu component.
 * Simulates authenticated and unauthenticated states.
 * Ready to be connected to DRF + JWT authentication later.
 */
export function UserMenu() {
  /**
   * UI-only auth simulation
   * Set to `true` to preview logged-in state
   */
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Mock user data (replace with real user later)
  const user = isAuthenticated
    ? {
        email: "user@medvault.com",
        initials: "UM",
      }
    : null;

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          // UI-only placeholder
          alert("Demo mode: redirect to login page");
        }}
      >
=======
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User, LogOut, Settings } from "lucide-react";

type UserMenuProps = {
  user?: {
    email?: string;
    avatarUrl?: string;
  } | null;
  loading?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onProfile?: () => void;
};

export function UserMenu({
  user,
  loading = false,
  onSignIn,
  onSignOut,
  onProfile,
}: UserMenuProps) {
  if (loading) {
    return <Button>Loading…</Button>;
  }

  if (!user) {
    return (
      <Button onClick={onSignIn}>
>>>>>>> origin/frontend
        <LogOut className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    );
  }

<<<<<<< HEAD
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.initials}</AvatarFallback>
=======
  const email = user.email ?? "User";
  const initials = email
    .split("@")[0]
    .split(".")
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={email} />
            <AvatarFallback>{initials}</AvatarFallback>
>>>>>>> origin/frontend
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

<<<<<<< HEAD
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              Account
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
=======
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Account</span>
            <span className="text-xs text-gray-500">{email}</span>
>>>>>>> origin/frontend
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

<<<<<<< HEAD
        <DropdownMenuItem
          onClick={() => {
            alert("Demo mode: open profile");
          }}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
=======
        <DropdownMenuItem onClick={onProfile}>
          <User className="mr-2 h-4 w-4" />
          Profile
>>>>>>> origin/frontend
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Settings className="mr-2 h-4 w-4" />
<<<<<<< HEAD
          <span>Settings</span>
=======
          Settings
>>>>>>> origin/frontend
        </DropdownMenuItem>

        <DropdownMenuSeparator />

<<<<<<< HEAD
        <DropdownMenuItem
          onClick={() => {
            // UI-only sign-out simulation
            setIsAuthenticated(false);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
=======
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
>>>>>>> origin/frontend
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
