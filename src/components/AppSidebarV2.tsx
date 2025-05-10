
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { MainNavigation } from "./MainNavigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const AppSidebarV2 = () => {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const collapsed = state === "collapsed";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <Sidebar className="bg-white border-r">
      <SidebarHeader className="border-b py-3">
        <div className={cn(
          "flex items-center px-2", 
          collapsed ? "justify-center" : "justify-start"
        )}>
          <Logo minimal={collapsed} />
          {!collapsed && (
            <span className="ml-2 text-lg font-medium text-gray-800">
              AmbulLink
            </span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <MainNavigation collapsed={collapsed} />
      </SidebarContent>
      
      <SidebarFooter className="border-t py-3 px-3">
        <Button 
          variant="ghost" 
          onClick={logout} 
          className={cn(
            "w-full flex items-center text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
