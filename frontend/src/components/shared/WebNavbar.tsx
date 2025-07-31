import { Link } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Building2Icon, LogOutIcon, SettingsIcon } from "lucide-react"

export default function WebNavbar() {
    return <div className="w-full max-w-full h-[80px] bg-sidebar flex flex-col justify-center">
        <div className="flex max-w-6xl w-full m-auto bg-red justify-between">
            <div className="flex gap-x-5 mt-1">
                <Link to="/"><p>Home</p></Link>
            </div>
            <div>
                <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Link to="/app/organizations"><DropdownMenuItem><Building2Icon />Organizations</DropdownMenuItem></Link>
                    <DropdownMenuItem><SettingsIcon />Settings</DropdownMenuItem>
                    <DropdownMenuItem><LogOutIcon />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </div>
}
