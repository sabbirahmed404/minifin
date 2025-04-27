"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePin } from "../lib/data/PinContext";
import LoadingOverlay from "./LoadingOverlay";

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated } = usePin();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingOverlay show={true} message="Verifying access..." />;
  }

  return <>{children}</>;
} 