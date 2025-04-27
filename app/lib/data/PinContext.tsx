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

// Create the context with undefined as initial value
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
    if (typeof window !== 'undefined') {
      const storedAuthState = localStorage.getItem("pin_authenticated");
      const storedDemoState = localStorage.getItem("demo_mode");
      
      if (storedAuthState === "true") {
        setIsAuthenticated(true);
      }
      
      if (storedDemoState === "true") {
        setIsDemo(true);
        setIsAuthenticated(true); // Always ensure authenticated when in demo mode
      }
      
      // For debugging
      console.log(`Auth state on mount: isAuthenticated=${storedAuthState === "true"}, isDemo=${storedDemoState === "true"}`);
    }
  }, []);

  // Also check on every route change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleRouteChange = () => {
        const storedDemoState = localStorage.getItem("demo_mode");
        
        if (storedDemoState === "true" && !isDemo) {
          console.log('Route changed: Restoring demo mode state');
          setIsDemo(true);
          setIsAuthenticated(true);
        }
      };

      // Add event listener for route changes
      window.addEventListener('popstate', handleRouteChange);
      
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, [isDemo]);

  const authenticateWithPin = (pin: string): boolean => {
    if (pin === DEFAULT_PIN) {
      // Exit demo mode if active
      if (isDemo) {
        localStorage.removeItem("demo_mode");
      }
      
      setIsAuthenticated(true);
      setIsDemo(false);
      localStorage.setItem("pin_authenticated", "true");
      console.log('Authenticated with PIN');
      return true;
    }
    return false;
  };

  const enterDemoMode = () => {
    console.log('Entering demo mode');
    setIsDemo(true);
    setIsAuthenticated(true);
    localStorage.setItem("demo_mode", "true");
    localStorage.setItem("pin_authenticated", "true");
  };

  const exitDemoMode = () => {
    console.log('Exiting demo mode');
    setIsDemo(false);
    setIsAuthenticated(false);
    localStorage.removeItem("demo_mode");
    localStorage.removeItem("pin_authenticated");
  };

  const logout = () => {
    console.log('Logging out');
    setIsAuthenticated(false);
    setIsDemo(false);
    localStorage.removeItem("pin_authenticated");
    localStorage.removeItem("demo_mode");
  };

  return (
    <PinContext.Provider value={{ 
      isAuthenticated, 
      isPinRequired, 
      isDemo,
      authenticateWithPin,
      enterDemoMode,
      exitDemoMode,
      logout
    }}>
      {children}
    </PinContext.Provider>
  );
}; 