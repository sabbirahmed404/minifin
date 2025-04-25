"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

type LoadingOverlayProps = {
  show: boolean;
  message?: string;
};

export default function LoadingOverlay({ show, message = "Loading..." }: LoadingOverlayProps) {
  const [visible, setVisible] = useState(false);
  
  // Add a small delay to avoid flashing for very quick operations
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (show) {
      timeout = setTimeout(() => {
        setVisible(true);
      }, 300);
    } else {
      setVisible(false);
    }
    
    return () => {
      clearTimeout(timeout);
    };
  }, [show]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-[#09122C] border border-[#BE3144]/30 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col items-center">
        <RefreshCw className="h-8 w-8 animate-spin text-[#BE3144] mb-4" />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
} 