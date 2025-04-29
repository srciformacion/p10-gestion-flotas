
import { useState, useCallback } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";
import { MobileMenu } from "./navbar/MobileMenu";
import { DesktopNavigation } from "./navbar/DesktopNavigation";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  // Determine what links to show based on user role
  const showDashboardLink = user && user.role !== 'individual';
  const showAdvancedRequestLink = user && (user.role === 'hospital' || user.role === 'admin');

  return (
    <nav className="bg-white dark:bg-gray-900 border-b sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <DesktopNavigation 
            user={user}
            logout={logout}
            showDashboardLink={showDashboardLink}
            showAdvancedRequestLink={showAdvancedRequestLink}
          />

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        user={user}
        closeMenu={closeMenu}
        logout={logout}
        showDashboardLink={showDashboardLink}
        showAdvancedRequestLink={showAdvancedRequestLink}
      />
    </nav>
  );
};
