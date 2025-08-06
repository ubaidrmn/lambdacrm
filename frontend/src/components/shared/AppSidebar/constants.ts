import type { SidebarItem } from "./types";
import { Building2, ChevronsUp, Contact, Home } from "lucide-react"

export const getSidebarItems = (params: any): SidebarItem[] => [
    {
      title: "Dashboard",
      url: `/app/organizations/${params.organizationId}/dashboard`,
      icon: Home,
    },
    {
      title: "Companies",
      url: `/app/organizations/${params.organizationId}/leads`,
      icon: Building2,
    },
    {
      title: "Leads",
      url: `/app/organizations/${params.organizationId}/leads`,
      icon: ChevronsUp,
    },
    {
      title: "Contacts",
      url: `/app/organizations/${params.organizationId}/contacts`,
      icon: Contact,
    },
];
