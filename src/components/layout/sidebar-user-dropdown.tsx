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
import { DropdownDialogItem } from "@/components/ui/dropdown-dialog-item";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function AppSidebarUserDropdown() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const user = authStore.user;
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

          <DropdownDialogItem
            title="Keluar"
            trigger={
              <>
                <LogOut />
                <span>Keluar</span>
              </>
            }
            footer={
              <div className="flex flex-row gap-2">
                <Button variant="ghost">Batal</Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    authStore.logout();
                    navigate("/login");
                  }}
                >
                  Keluar
                </Button>
              </div>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
