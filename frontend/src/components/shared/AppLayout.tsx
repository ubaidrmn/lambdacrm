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
            <main>
                <div className="p-4">
                    {props.children}
                </div>
            </main>
        </SidebarProvider>
    )
}

export default AppLayout;
