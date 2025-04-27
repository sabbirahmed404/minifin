"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePin } from "./lib/data/PinContext";
import { Button } from "@/components/ui/button";
import { PlayIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isDemo, enterDemoMode } = usePin();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);
  
  const handleDemoMode = () => {
    enterDemoMode();
    router.push("/dashboard");
  };
  
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#09122C] text-white">
        <p className="text-lg animate-pulse">Loading your financial dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09122C] text-white px-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex justify-center mb-2">
            <Image 
              src="/logo.png" 
              alt="MiniFin Logo" 
              width={180} 
              height={90} 
              priority
              className="h-auto w-auto" 
            />
          </div>
          <p className="text-xl">Your personal financial dashboard</p>
        </div>
        
        <div className="space-y-4 pt-8">
          <Button 
            className="w-full bg-[#BE3144] hover:bg-[#872341] text-white py-6 text-lg"
            asChild
          >
            <Link href="/pincode" className="flex items-center justify-center gap-2">
              <LockIcon className="h-5 w-5" />
              Enter with PIN
            </Link>
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-[#BE3144]/50 text-white hover:bg-[#BE3144]/20 py-6 text-lg"
            onClick={handleDemoMode}
          >
            <PlayIcon className="mr-2 h-5 w-5" />
            Try Demo Mode
          </Button>
        </div>
      </div>
    </div>
  );
}
