import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/shared/AppSidebar"
import { useContext, useEffect, type ReactNode } from "react";
import AuthContext from "@/features/auth/context";
import { useLocation, useNavigate, useParams } from "react-router";

type AppLayoutProps = {
    children: ReactNode
};

function AppLayout (props: AppLayoutProps) {
    const authContext = useContext(AuthContext);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (authContext.auth.user && params?.organizationId) {
            if (authContext.auth.user.organizations
                && !authContext.auth.user?.organizations.find(org => org.organizationId === params.organizationId)
            ) {
                navigate("/app/organizations");
            }
        }
    }, [authContext.auth.user, location.pathname]);1
    
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
