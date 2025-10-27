"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/lib/contexts/user-context";
import { 
  Grid3X3, 
  Trophy, 
  MessageCircle, 
  Bell, 
  Download, 
  Settings,
  BarChart3,
  Users,
  Home
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isActive?: boolean;
}

const allNavigationItems: NavItem[] = [
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

export default function Sidebar({ className = "" }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter((item) => {
    // If loading or no user, show all items (will refresh once loaded)
    if (loading || !user) {
      return true;
    }
    // Show all items for admins
    if (user.isAdmin) {
      return true;
    }
    // For members, hide analytics (admin-only)
    if (item.id === "analytics") {
      return false;
    }
    return true;
  });

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div 
      className={`w-20 flex flex-col items-center py-6 gap-4 h-screen ${className}`}
      style={{ 
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
        paddingTop: '40px'
      }}
    >
      {/* Logo with gradient */}
      <Link href="/dashboard">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 animate-gradient cursor-pointer hover:scale-105 transition-transform duration-200"
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
      </Link>
      
      {/* Navigation Icons */}
      <div className="flex flex-col gap-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isHovered = hoveredItem === item.id;
          
          return (
            <div
              key={item.id}
              className="relative group"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div 
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  active 
                    ? 'animate-pulse-glow' 
                    : 'hover:opacity-80'
                }`}
                style={{ 
                  background: active 
                    ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))'
                    : isHovered
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: active 
                    ? '0 0 15px rgba(59, 130, 246, 0.4)'
                    : 'none',
                  border: active 
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => handleNavigation(item.href)}
                title={item.label}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              
              {/* Tooltip */}
              <div 
                className={`absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg transition-all duration-200 pointer-events-none z-50 ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {item.label}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Settings at bottom */}
      <div className="mt-auto">
        <div
          className="relative group"
          onMouseEnter={() => setHoveredItem('settings')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-all duration-300 cursor-pointer"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => handleNavigation('/settings')}
            title="Settings"
          >
            <Settings className="h-5 w-5 text-white" />
          </div>
          
          {/* Tooltip */}
          <div 
            className={`absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg transition-all duration-200 pointer-events-none z-50 ${
              hoveredItem === 'settings' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
            style={{ whiteSpace: 'nowrap' }}
          >
            Settings
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
