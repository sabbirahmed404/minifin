"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define currency types
export type CurrencyCode = 'BDT' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const currencies: Record<CurrencyCode, CurrencyInfo> = {
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
};

interface CurrencyContextType {
  currentCurrency: CurrencyInfo;
  setCurrency: (currencyCode: CurrencyCode) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyInfo>(currencies.BDT);

  // On mount, check if there's a saved currency preference
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem('preferred_currency');
      if (savedCurrency && Object.keys(currencies).includes(savedCurrency)) {
        setCurrentCurrency(currencies[savedCurrency as CurrencyCode]);
      }
    } catch (error) {
      console.error('Failed to load currency preference:', error);
    }
  }, []);

  // Save currency preference when it changes
  useEffect(() => {
    try {
      localStorage.setItem('preferred_currency', currentCurrency.code);
    } catch (error) {
      console.error('Failed to save currency preference:', error);
    }
  }, [currentCurrency]);

  const setCurrency = (currencyCode: CurrencyCode) => {
    if (currencies[currencyCode]) {
      setCurrentCurrency(currencies[currencyCode]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency.code,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}; 