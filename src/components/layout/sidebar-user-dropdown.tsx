import { useSidebar } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut, CircleUser } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
import { Link } from "react-router";

export default function AppSidebarUserDropdown() {
  const { isMobile } = useSidebar();
  const { user } = useAuthStore();
  const avatar = user
    ? createAvatar(botttsNeutral, { seed: user.email })?.toDataUri()
    : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={avatar} alt={user?.name} />
            <AvatarFallback className="rounded-lg">{user?.name}</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate text-left">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {user?.email}
            </p>
          </div>
          <ChevronsUpDown className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatar} alt={user?.name} />
              <AvatarFallback className="rounded-lg">
                {user?.name}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-muted-foreground text-xs">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile">
              <CircleUser />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/logout">
              <LogOut />
              <span>Keluar</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
