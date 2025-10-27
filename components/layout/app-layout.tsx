"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/ui/sidebar";
import MobileNav from "@/components/ui/mobile-nav";

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)',
      position: 'relative'
    }}>

      <div className="flex relative z-10">
        {showSidebar && (
          <div className="hidden sm:block">
            <Sidebar />
          </div>
        )}
        <div className="flex-1 pt-8 main-content">
          {children}
        </div>
        {showSidebar && <MobileNav />}
      </div>
    </div>
  );
}

