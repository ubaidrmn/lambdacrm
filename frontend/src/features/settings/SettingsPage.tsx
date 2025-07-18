import { useTheme } from "@/components/shared/ThemeProvider/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator";
import { Moon, Sun } from "lucide-react";

const SettingsPage = () => {
    const { setTheme } = useTheme()
    
    return (
        <div>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                Settings
            </h2>
            <p className="leading-7 mt-2 mb-2">
                Manage your settings here. You can configure your preferences, manage users, and customize your CRM experience.
            </p>

            <Separator className="mt-4 mb-4" />

            <div className="flex gap-x-4">
              <p className="mt-1">              
                Select theme
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
    );
}

export default SettingsPage;
