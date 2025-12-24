import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
        <LogOut className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    );
  }

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
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">Account</span>
            <span className="text-xs text-gray-500">{email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onProfile}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
