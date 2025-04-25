"use client";

import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#09122C] text-white p-6 pb-20 md:pb-6">
        {children}
      </main>
      <MobileNav />
    </div>
  );
} 