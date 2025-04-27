"use client";

import { useState } from "react";
import { usePin } from "../lib/data/PinContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LockIcon, KeyIcon, PlayIcon } from "lucide-react";

export default function PinEntry() {
  const { authenticateWithPin, enterDemoMode } = usePin();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin) {
      setError("Please enter a PIN code");
      return;
    }
    
    const success = authenticateWithPin(pin);
    
    if (!success) {
      setError("Invalid PIN code");
      setPin("");
    }
  };

  const handleDemoMode = () => {
    enterDemoMode();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09122C] text-white px-4">
      <Card className="w-full max-w-md border-[#BE3144]/30 bg-[#09122C]/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto rounded-full bg-[#BE3144]/20 p-3 mb-3">
            <LockIcon className="h-6 w-6 text-[#BE3144]" />
          </div>
          <CardTitle className="text-2xl">MiniFin</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your PIN to access your financial data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError("");
                  }}
                  className="pl-10 bg-[#09122C]/50 border-[#BE3144]/50 text-white"
                  maxLength={5}
                />
                <KeyIcon className="absolute left-3 top-2.5 h-5 w-5 text-[#BE3144]/70" />
              </div>
              {error && <p className="text-[#E17564] text-sm">{error}</p>}
            </div>
            
            <div className="space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-[#BE3144] hover:bg-[#872341] text-white"
              >
                Unlock
              </Button>
              
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="px-3 text-sm text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>
              
              <Button 
                type="button" 
                variant="outline"
                className="w-full border-[#BE3144]/50 text-white hover:bg-[#BE3144]/20"
                onClick={handleDemoMode}
              >
                <PlayIcon className="mr-2 h-4 w-4" />
                Try Demo Mode
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 