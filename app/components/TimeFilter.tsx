"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimeFilterOption = "7days" | "month" | "year" | "all";

interface TimeFilterProps {
  onChange: (value: TimeFilterOption) => void;
  value: TimeFilterOption;
  className?: string;
}

export function TimeFilter({ onChange, value, className = "" }: TimeFilterProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TimeFilterOption)}
      >
        <SelectTrigger className="w-[130px] h-8 text-xs bg-background border-[#BE3144]/30">
          <SelectValue placeholder="Filter by time" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="month">Last month</SelectItem>
          <SelectItem value="year">This year</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 