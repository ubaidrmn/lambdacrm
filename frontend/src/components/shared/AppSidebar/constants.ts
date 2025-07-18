import type { SidebarItem } from "./types";
import { Contact, Home, Settings, User } from "lucide-react"

export const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Leads",
      url: "/leads",
      icon: User,
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: Contact,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
];
