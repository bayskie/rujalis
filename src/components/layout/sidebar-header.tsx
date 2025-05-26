import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Waypoints } from "lucide-react";
import { Link } from "react-router";

export default function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link
              to="/"
              className="flex min-h-[56px] items-center gap-2 px-3 py-2"
            >
              <Waypoints className="!size-7" />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold">Rujalis</span>
                <span className="text-muted-foreground text-xs">
                  Ruas Jalan Information System
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
