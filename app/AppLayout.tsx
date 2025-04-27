"use client";

import { ReactNode, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import { usePin } from "./lib/data/PinContext";
import RouteGuard from "./components/RouteGuard";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, logout, isDemo, enterDemoMode } = usePin();
  
  // This ensures demo mode is preserved during navigation in deployed environments
  useEffect(() => {
    // Check if we should be in demo mode based on localStorage
    if (typeof window !== 'undefined') {
      const storedDemoState = localStorage.getItem("demo_mode");
      
      // If localStorage indicates we should be in demo mode but context doesn't reflect that
      if (storedDemoState === "true" && !isDemo) {
        console.log('Restoring demo mode from localStorage');
        enterDemoMode();
      }
    }
  }, [isDemo, enterDemoMode]);
  
  return (
    <RouteGuard>
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#09122C] text-white p-6 pb-20 md:pb-6">
          {children}
          <div className="md:hidden pb-[75px]"></div>
        </main>
        <MobileNav />
      </div>
    </RouteGuard>
  );
} 