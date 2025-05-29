import { AppHeader } from "@/components/layout/header";
import AppSidebar from "@/components/layout/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex h-full flex-1 flex-col">
          <div className="@container/main flex h-full flex-1 flex-col gap-2">
            <div className="flex h-full flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="h-full px-4 lg:px-6">{children}</div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
