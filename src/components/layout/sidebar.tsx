import AppSidebarFooter from "@/components/layout/sidebar-footer";
import AppSidebarHeader from "@/components/layout/sidebar-header";
import AppSidebarNavigation from "@/components/layout/sidebar-navigation";
import { Sidebar, SidebarRail } from "@/components/ui/sidebar";

export default function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <AppSidebarHeader />
      <AppSidebarNavigation />
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
