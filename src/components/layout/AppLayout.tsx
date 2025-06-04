
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { BackButton } from "@/components/ui/back-button";
import { SmartBreadcrumb } from "@/components/navigation/SmartBreadcrumb";

interface AppLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ label: string; href?: string; isCurrentPage?: boolean }>;
}

export function AppLayout({ children, showBreadcrumbs = true, breadcrumbItems }: AppLayoutProps) {
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
              {showBreadcrumbs && (
                <div className="mb-4">
                  <SmartBreadcrumb items={breadcrumbItems} />
                </div>
              )}
              
              {children}
              
              {/* Back button al final del contenido */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-start">
                <BackButton className="text-rioja-blue hover:text-rioja-green hover:bg-rioja-green/10" />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
