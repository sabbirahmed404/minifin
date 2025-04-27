"use client";

import { usePin } from "../lib/data/PinContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlayIcon } from "lucide-react";

export default function DemoModeIndicator() {
  const { isDemo } = usePin();
  
  if (!isDemo) return null;
  

} 