import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  House,
  Map,
  Milestone,
  MapPinned,
  Database,
  ChevronRight,
  Boxes,
  ListOrdered,
  ActivitySquare,
} from "lucide-react";
import { Link } from "react-router";
import SidebarSettingDialog from "@/components/layout/sidebar-setting-dialog-copy";

const baseNavigation = [
  { name: "Beranda", to: "/", icon: House },
  { name: "Peta", to: "/map", icon: Map },
  { name: "Ruas Jalan", to: "/road-segments", icon: Milestone },
  { name: "Wilayah", to: "/regions", icon: MapPinned },
];

const masterDataNavigation = [
  { name: "Material Jalan", to: "/road-materials", icon: Boxes },
  { name: "Jenis Jalan", to: "/road-types", icon: ListOrdered },
  { name: "Kondisi Jalan", to: "/road-conditions", icon: ActivitySquare },
];

export default function AppSidebarNavigation() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {baseNavigation.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.to}
                    className="flex min-h-[40px] items-center gap-2 px-3 py-2"
                  >
                    <item.icon className="!size-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex min-h-[40px] items-center gap-2 px-3 py-2">
                    <Database className="!size-5" />
                    <span>Master Data</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {masterDataNavigation.map((item) => (
                      <SidebarMenuSubItem key={item.to}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.to}
                            className="flex min-h-[40px] items-center gap-2 px-3 py-2"
                          >
                            <item.icon className="!size-5" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarSettingDialog />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
