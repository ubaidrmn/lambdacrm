import { Link } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Building2Icon, LogOutIcon, SettingsIcon } from "lucide-react"
import TokenService from "@/lib/token-service"
import { useContext } from "react"
import AuthContext from "@/features/auth/context"

export default function WebNavbar() {
    const authContext = useContext(AuthContext);

    return <div className="w-full max-w-full h-[80px] bg-sidebar flex flex-col justify-center">
        <div className="flex max-w-6xl w-full m-auto bg-red justify-between">
            <div className="flex gap-x-5">
                <Link className={`${authContext.auth.isAuthenticated && 'mt-2'}`} to="/"><p>Home</p></Link>
            </div>
            <div className="flex gap-x-5">
            {authContext.auth?.isAuthenticated ?               
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
                        <DropdownMenuItem onClick={() => {
                            const tokenService = TokenService.getInstance();
                            tokenService.deleteTokens();
                        }}><LogOutIcon />Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> :
                <>
                    <Link to="/login"><p>Login</p></Link>
                    <Link to="/signup"><p>Register</p></Link>
                </>
                }
            </div>
        </div>
    </div>
}
