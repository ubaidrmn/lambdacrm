import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/shared/AppSidebar"
import type { ReactNode } from "react";

type AppLayoutProps = {
    children: ReactNode
};

function AppLayout (props: AppLayoutProps) {
    return (
        <SidebarProvider>
        <AppSidebar />
            <div className="p-4 max-w-full w-full">
                {props.children}
            </div>
        </SidebarProvider>
    )
}

export default AppLayout;
