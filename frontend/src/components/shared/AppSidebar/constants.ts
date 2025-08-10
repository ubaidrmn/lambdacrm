import type { SidebarItem } from "./types";
import { ChevronsUp, Contact, Home, SettingsIcon } from "lucide-react"

export const getSidebarItems = (params: any): SidebarItem[] => [
    {
      title: "Dashboard",
      url: `/app/organizations/${params.organizationId}/dashboard`,
      icon: Home,
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
    {
      title: "Settings",
      url: `/app/organizations/${params.organizationId}/settings`,
      icon: SettingsIcon,
    },
];
