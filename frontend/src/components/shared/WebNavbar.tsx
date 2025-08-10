import { Link, useLocation, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Building2Icon, LogOutIcon, Menu, X, Workflow, Sparkles } from "lucide-react";
import TokenService from "@/lib/token-service";
import { useContext, useState } from "react";
import AuthContext from "@/features/auth/context";
import { Button } from "../ui/button";

export default function WebNavbar() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    const tokenService = TokenService.getInstance();
    tokenService.deleteTokens();
    navigate("/");
  };

  const NavLinks = () => (
    <ul className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 text-sm font-medium tracking-wide">
      <li>
        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
      </li>
      <li>
        <Link to="/app/organizations" className="text-muted-foreground hover:text-foreground transition-colors">Get Started</Link>
      </li>
    </ul>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-inset ring-white/10">
              <Workflow className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold bg-gradient-to-r from-foreground via-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-90">
              LambdaCRM
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          {location.pathname == "/" && <NavLinks />}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {authContext.auth?.isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>LC</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  Signed in
                </div>
                <Link to="/app/organizations">
                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Building2Icon className="h-4 w-4" /> Organizations
                  </DropdownMenuItem>
                </Link>
                {/* <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User className="h-4 w-4" /> Profile (soon)
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-red-600 cursor-pointer focus:text-red-600">
                  <LogOutIcon className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-1">
                  <Sparkles className="h-4 w-4" /> Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/80 backdrop-blur px-4 pb-6 pt-4 animate-in slide-in-from-top duration-150">
          <NavLinks />
          {!authContext.auth?.isAuthenticated && (
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link to="/signup">
                <Button className="w-full" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
          {authContext.auth?.isAuthenticated && (
            <div className="mt-6">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
                <LogOutIcon className="h-4 w-4" /> Sign out
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
