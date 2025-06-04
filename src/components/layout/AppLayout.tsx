
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          <AppHeader />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
