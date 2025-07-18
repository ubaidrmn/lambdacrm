import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/shared/AppSidebar"
import type { AppLayoutProps } from "./types";

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
