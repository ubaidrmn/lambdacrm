import { Link, useParams } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { SidebarItem } from "@/components/shared/AppSidebar/types"
import { getSidebarItems } from "./constants";
import { Building2Icon, ChevronDown, ChevronUp, LogOutIcon, PlusIcon, SettingsIcon, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AppSidebar() {
  const params = useParams();

  return (
    <Sidebar>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <Building2Icon /> Demo Organization
                <ChevronDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem><PlusIcon />Create Organization</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Select Organization</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Demo Organization</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ SidebarMenuItem>
        <SidebarMenuItem>
          <div className="p-2">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
              LambdaCRM
            </h3>
            <Input placeholder="Type Something.." className="mt-4 h-[30px]" />
            <Button className="w-full max-w-full mt-2 h-[30px]" variant={"default"}>Search</Button>
          </div>
        </ SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getSidebarItems(params).map((item: SidebarItem) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Ubaid Ur Rehman
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link to="/settings">
                  <DropdownMenuItem>
                    <SettingsIcon />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <LogOutIcon />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar;
