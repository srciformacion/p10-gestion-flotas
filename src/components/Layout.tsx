
import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "@/context/auth";
import { AppSidebarV2 } from "./AppSidebarV2";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export const Layout = ({ children, showSidebar = true, showFooter = true }: LayoutProps) => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {showSidebar && user && <AppSidebarV2 />}
        <SidebarInset>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            {showFooter && <Footer />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
