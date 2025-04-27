"use client";

import { ReactNode, useEffect, Suspense } from "react";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import { usePin } from "./lib/data/PinContext";
import RouteGuard from "./components/RouteGuard";
import { usePathname, useSearchParams } from "next/navigation";

interface AppLayoutProps {
  children: ReactNode;
}

// Create a client component that uses useSearchParams
function DemoModeHandler() {
  const { isDemo, enterDemoMode } = usePin();
  const searchParams = useSearchParams();
  
  // Check URL for demo parameter which is useful for direct links
  useEffect(() => {
    const isDemoParam = searchParams?.get('demo') === 'true';
    if (isDemoParam && !isDemo) {
      console.log('Demo parameter detected in URL, entering demo mode');
      enterDemoMode();
    }
  }, [searchParams, isDemo, enterDemoMode]);
  
  return null; // This component doesn't render anything
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, logout, isDemo, enterDemoMode } = usePin();
  const pathname = usePathname();
  
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
  
  // Log current path and demo status for debugging
  useEffect(() => {
    console.log(`Route changed to: ${pathname}, Demo mode: ${isDemo}`);
  }, [pathname, isDemo]);
  
  return (
    <RouteGuard>
      <div className="flex h-screen w-full">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#09122C] text-white p-6 pb-20 md:pb-6">
          <Suspense fallback={null}>
            <DemoModeHandler />
          </Suspense>
          {children}
          <div className="md:hidden pb-[75px]"></div>
        </main>
        <MobileNav />
      </div>
    </RouteGuard>
  );
} 