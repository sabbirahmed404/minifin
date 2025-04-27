"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePin } from "../lib/data/PinContext";
import PinEntry from "../components/PinEntry";

export default function PincodePage() {
  const router = useRouter();
  const { isAuthenticated, isDemo } = usePin();
  
  useEffect(() => {
    if (isAuthenticated && !isDemo) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isDemo, router]);
  
  return <PinEntry />;
} 