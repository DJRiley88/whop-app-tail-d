"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Home, 
  Grid3X3, 
  Trophy, 
  BarChart3, 
  Settings,
  Menu,
  X
} from "lucide-react";

interface MobileNavProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard"
  },
  {
    id: "discover",
    label: "Discover",
    icon: Grid3X3,
    href: "/discover"
  },
  {
    id: "leaderboard",
    label: "Leaderboard", 
    icon: Trophy,
    href: "/leaderboard"
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics"
  }
];

export default function MobileNav({ className = "" }: MobileNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="sm:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#1A1A1A] border border-gray-800/50 hover:bg-[#3EE58D]/10 transition-all duration-200"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-[#1A1A1A] border-l border-gray-800/50 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <div className="mb-8">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center animate-gradient"
                style={{ 
                  background: 'linear-gradient(45deg, var(--accent-cyan), var(--accent-purple))',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)'
                }}
              >
                <div 
                  className="w-8 h-8 rounded-sm"
                  style={{ background: 'var(--bg-primary)' }}
                ></div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      active 
                        ? 'bg-[#3EE58D]/20 text-[#3EE58D] border border-[#3EE58D]/30' 
                        : 'text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Settings */}
            <div className="mt-8 pt-6 border-t border-gray-800/50">
              <button
                onClick={() => handleNavigation('/settings')}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-white/5 transition-all duration-200"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
