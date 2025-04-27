"use client";

import { ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePin } from "../lib/data/PinContext";

interface DemoLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function DemoLink({ href, children, className }: DemoLinkProps) {
  const { isDemo } = usePin();
  const router = useRouter();
  
  const handleClick = (e: MouseEvent) => {
    if (isDemo) {
      e.preventDefault();
      
      // Ensure demo mode is set in localStorage before navigation
      localStorage.setItem('demo_mode', 'true');
      localStorage.setItem('pin_authenticated', 'true');
      
      // Add demo parameter to the URL if not already present
      const url = new URL(href, window.location.origin);
      if (!url.searchParams.has('demo')) {
        url.searchParams.set('demo', 'true');
      }
      
      // Use router.push for client-side navigation to maintain state
      router.push(url.pathname + url.search);
    }
  };
  
  return (
    <Link 
      href={isDemo ? `${href}?demo=true` : href} 
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
} 