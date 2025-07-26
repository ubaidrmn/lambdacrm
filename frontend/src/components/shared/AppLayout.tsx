import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/shared/AppSidebar"
import type { ReactNode } from "react";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

type AppLayoutProps = {
    children: ReactNode
};

function AppLayout (props: AppLayoutProps) {
    return (
        <ProtectedRoute>
            <SidebarProvider>
            <AppSidebar />
                <main>
                    <div className="p-4">
                        {props.children}
                    </div>
                </main>
            </SidebarProvider>
        </ProtectedRoute>
    )
}

export default AppLayout;
