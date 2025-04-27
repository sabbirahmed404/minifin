"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define a default pin for the app (in a real app, you would store this securely)
const DEFAULT_PIN = "22211";

interface PinContextType {
  isAuthenticated: boolean;
  isPinRequired: boolean;
  isDemo: boolean;
  authenticateWithPin: (pin: string) => boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  logout: () => void;
}

const PinContext = createContext<PinContextType | undefined>(undefined);

export const usePin = () => {
  const context = useContext(PinContext);
  if (!context) {
    throw new Error("usePin must be used within a PinProvider");
  }
  return context;
};

export const PinProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isPinRequired, setIsPinRequired] = useState<boolean>(true);

  // Check if we have a stored auth state on mount
  useEffect(() => {
    const storedAuthState = localStorage.getItem("pin_authenticated");
    const storedDemoState = localStorage.getItem("demo_mode");
    
    if (storedAuthState === "true") {
      setIsAuthenticated(true);
    }
    
    if (storedDemoState === "true") {
      setIsDemo(true);
    }
  }, []);

  const authenticateWithPin = (pin: string): boolean => {
    if (pin === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setIsDemo(false);
      localStorage.setItem("pin_authenticated", "true");
      localStorage.removeItem("demo_mode");
      return true;
    }
    return false;
  };

  const enterDemoMode = () => {
    setIsDemo(true);
    setIsAuthenticated(true);
    localStorage.setItem("demo_mode", "true");
    localStorage.setItem("pin_authenticated", "true");
  };

  const exitDemoMode = () => {
    setIsDemo(false);
    setIsAuthenticated(false);
    localStorage.removeItem("demo_mode");
    localStorage.removeItem("pin_authenticated");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsDemo(false);
    localStorage.removeItem("pin_authenticated");
    localStorage.removeItem("demo_mode");
  };

  const value = {
    isAuthenticated,
    isPinRequired,
    isDemo,
    authenticateWithPin,
    enterDemoMode,
    exitDemoMode,
    logout
  };

  return (
    <PinContext.Provider value={value}>
      {children}
    </PinContext.Provider>
  );
}; 