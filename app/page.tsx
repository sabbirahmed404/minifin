"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePin } from "./lib/data/PinContext";
import PinEntry from "./components/PinEntry";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = usePin();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return <PinEntry />;
  }
  
  return (
    <div className="flex items-center justify-center h-screen bg-[#09122C] text-white">
      <p className="text-lg animate-pulse">Loading your financial dashboard...</p>
    </div>
  );
}
