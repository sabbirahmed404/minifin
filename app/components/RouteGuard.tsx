"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePin } from "../lib/data/PinContext";
import LoadingOverlay from "./LoadingOverlay";

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isDemo } = usePin();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Don't redirect if on public routes
    const publicRoutes = ['/', '/demo', '/pincode'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Only redirect if not authenticated and not on a public route
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/");
    }
    
    // Remove loading state after a short delay for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, router, pathname]);

  if (isLoading && !isAuthenticated) {
    return <LoadingOverlay show={true} message="Verifying access..." />;
  }

  return <>{children}</>;
} 