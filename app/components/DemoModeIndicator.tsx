"use client";

import { usePin } from "../lib/data/PinContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlayIcon } from "lucide-react";

export default function DemoModeIndicator() {
  const { isDemo } = usePin();
  
  if (!isDemo) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-600 p-2 text-center md:p-3">
      <div className="flex items-center justify-center gap-2 text-white">
        <PlayIcon className="h-4 w-4" />
        <span className="text-sm font-medium">Demo Mode Active - Using Sample Data</span>
      </div>
    </div>
  );
} 