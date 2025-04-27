"use client";

import { ReactNode } from "react";
import { FinanceProvider } from "./lib/data/FinanceContext";
import { CurrencyProvider } from "./lib/data/CurrencyContext";
import { PinProvider } from "./lib/data/PinContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <PinProvider>
      <CurrencyProvider>
        <FinanceProvider>{children}</FinanceProvider>
      </CurrencyProvider>
    </PinProvider>
  );
} 