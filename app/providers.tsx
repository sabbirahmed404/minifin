"use client";

import { ReactNode } from "react";
import { FinanceProvider } from "./lib/data/FinanceContext";
import { CurrencyProvider } from "./lib/data/CurrencyContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <CurrencyProvider>
      <FinanceProvider>{children}</FinanceProvider>
    </CurrencyProvider>
  );
} 