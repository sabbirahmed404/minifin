"use client";

import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import { usePin } from "./lib/data/PinContext";
import RouteGuard from "./components/RouteGuard";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, logout, isDemo } = usePin();
  
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