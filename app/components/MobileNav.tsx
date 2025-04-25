"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PiggyBank, BarChart3, Settings, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

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
        "flex flex-col items-center justify-center gap-1 text-xs",
        isActive
          ? "text-[#BE3144]"
          : "text-gray-400 hover:text-[#BE3144]"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[#BE3144]/20 bg-[#09122C] px-4 py-2 flex items-center justify-around">
      <NavItem
        href="/dashboard"
        label="Dashboard"
        icon={<LayoutDashboard className="h-5 w-5" />}
      />
      <NavItem
        href="/transactions"
        label="Transactions"
        icon={<PiggyBank className="h-5 w-5" />}
      />
      <div className="relative -top-6">
        <Link
          href="/transactions/new"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#BE3144] text-white shadow-lg hover:bg-[#872341]"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
      <NavItem
        href="/analytics"
        label="Analytics"
        icon={<BarChart3 className="h-5 w-5" />}
      />
      <NavItem
        href="/settings"
        label="Settings"
        icon={<Settings className="h-5 w-5" />}
      />
    </div>
  );
} 