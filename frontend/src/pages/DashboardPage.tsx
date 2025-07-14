import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar"

const DashboardPage = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <SidebarTrigger />
                </main>
            </SidebarProvider>
        </div>
    );
}

export default DashboardPage;
