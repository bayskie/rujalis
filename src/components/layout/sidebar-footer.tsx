import SidebarUserDropdown from "@/components/layout/sidebar-user-dropdown";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function AppSidebarFooter() {
  return (
    <SidebarFooter className="border-t">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarUserDropdown />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
