
import React, { ReactNode } from "react";
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { SidebarUserProfile } from "@/components/layout/sidebar/SidebarUserProfile";
import { SidebarNavigation } from "@/components/layout/sidebar/SidebarNavigation";
import { SidebarLogout } from "@/components/layout/sidebar/SidebarLogout";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  console.log("Layout - rendering");
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <SidebarUserProfile />
          </SidebarHeader>
          <SidebarContent className="sidebar-scrollbar">
            <SidebarNavigation />
          </SidebarContent>
          <SidebarFooter>
            <SidebarLogout />
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 p-4 border-b">
              <SidebarTrigger />
            </div>
            <main className="flex-1 overflow-y-auto sidebar-scrollbar bg-background">
              <div className="relative w-full h-full z-10">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
