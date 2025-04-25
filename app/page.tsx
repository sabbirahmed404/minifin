"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen bg-[#09122C] text-white">
      <p className="text-lg animate-pulse">Loading your financial dashboard...</p>
    </div>
  );
}
