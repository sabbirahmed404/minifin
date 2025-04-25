"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PiggyBank, BarChart3, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFinance } from "../lib/data/FinanceContext";
import { useCurrency } from "../lib/data/CurrencyContext";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NavItem = ({ href, label, icon }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive 
          ? "bg-[#872341] text-white" 
          : "text-gray-400 hover:bg-[#872341]/10 hover:text-[#E17564]"
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

export default function Sidebar() {
  const { totalBalance, totalIncome, totalExpenses } = useFinance();
  const { formatCurrency, currentCurrency } = useCurrency();

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-[#09122C] border-r border-[#BE3144]/20 p-4">
      <div className="flex items-center  px-2">
        <Link href="/dashboard">
          <Image 
            src="/logo.png" 
            alt="MiniFin Logo" 
            width={64} 
            height={64} 
            className="h-30 w-auto" 
          />
        </Link>
      </div>
      
      
      <nav className="space-y-2">
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