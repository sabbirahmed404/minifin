"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PiggyBank, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinance } from "../lib/data/FinanceContext";
import { useCurrency } from "../lib/data/CurrencyContext";
import { usePin } from "../lib/data/PinContext";
import { PlayCircle } from "lucide-react";
import DemoLink from "./DemoLink";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NavItem = ({ href, label, icon }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");
  const { isDemo } = usePin();
  
  const linkClassName = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
    isActive 
      ? "bg-[#872341] text-white" 
      : "text-gray-400 hover:bg-[#872341]/10 hover:text-[#E17564]"
  );

  // Use DemoLink for demo mode, regular Link otherwise
  return isDemo ? (
    <DemoLink href={href} className={linkClassName}>
      {icon}
      {label}
    </DemoLink>
  ) : (
    <Link href={href} className={linkClassName}>
      {icon}
      {label}
    </Link>
  );
};

export default function Sidebar() {
  const { totalBalance, totalIncome, totalExpenses } = useFinance();
  const { formatCurrency, currentCurrency } = useCurrency();
  const { isDemo } = usePin();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-[#09122C] border-r border-[#BE3144]/20 p-4">
      <div className="flex justify-center items-center px-2 mb-4">
        {isDemo ? (
          <DemoLink href="/dashboard">
            <Image 
              src="/logo.png" 
              alt="MiniFin Logo" 
              width={140} 
              height={70} 
              priority
              className="h-auto w-auto" 
            />
          </DemoLink>
        ) : (
          <Link href="/dashboard">
            <Image 
              src="/logo.png" 
              alt="MiniFin Logo" 
              width={140} 
              height={70} 
              priority
              className="h-auto w-auto" 
            />
          </Link>
        )}
      </div>
      
      <div className="px-2">
        {isDemo && (
          <span className="bg-amber-500/20 text-amber-400 text-xs py-1 px-2 rounded-full flex items-center inline-block">
            <PlayCircle className="h-3 w-3 mr-1" />
            Demo
          </span>
        )}
      </div>
      
      <nav className="space-y-2 mt-6">
        <NavItem 
          href="/dashboard" 
          label="Dashboard" 
          icon={<LayoutDashboard className="h-4 w-4" />} 
        />
        <NavItem 
          href="/transactions" 
          label="Transactions" 
          icon={<PiggyBank className="h-4 w-4" />} 
        />
        <NavItem 
          href="/analytics" 
          label="Analytics" 
          icon={<BarChart3 className="h-4 w-4" />} 
        />
        <NavItem 
          href="/settings" 
          label="Settings" 
          icon={<Settings className="h-4 w-4" />} 
        />
      </nav>
      
      <div className="mt-auto pt-4">
        <div className="rounded-lg bg-[#09122C] border border-[#BE3144]/20 p-3">
          <h3 className="text-sm font-medium text-gray-200">Balance</h3>
          <div className="mt-1 text-xl font-bold text-white">{formatCurrency(totalBalance)}</div>
          <div className="mt-1 flex justify-between">
            <div>
              <div className="text-xs text-gray-400">Income</div>
              <div className="text-sm font-medium text-green-500">{formatCurrency(totalIncome)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Expenses</div>
              <div className="text-sm font-medium text-[#E17564]">{formatCurrency(totalExpenses)}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
} 