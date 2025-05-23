"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Info,
} from "lucide-react";
import AppLayout from "../AppLayout";
import { usePin } from "../lib/data/PinContext";
import { useRouter } from "next/navigation";
import DemoLink from "../components/DemoLink";

export default function Demo() {
  const { enterDemoMode, isDemo, exitDemoMode } = usePin();
  const router = useRouter();
  
  // Force activate demo mode when this page is loaded
  useEffect(() => {
    // First ensure we're in demo mode
    if (!isDemo) {
      console.log('Activating demo mode from demo page');
      
      // Exit any existing session first to clear state
      exitDemoMode();
      
      // Enter demo mode
      setTimeout(() => {
        enterDemoMode();
        
        // Alternative: set a URL parameter to maintain demo mode across page reloads
        const url = new URL(window.location.href);
        if (!url.searchParams.has('demo')) {
          url.searchParams.set('demo', 'true');
          window.history.replaceState({}, '', url.toString());
        }
      }, 100);
    }
    
    // Force localStorage to have demo_mode=true for Firebase checks
    localStorage.setItem('demo_mode', 'true');
    localStorage.setItem('pin_authenticated', 'true');
    
    // Set a session storage flag to remember we explicitly entered demo mode
    sessionStorage.setItem('explicit_demo_mode', 'true');
    
    // This cleanup function runs when component unmounts
    return () => {
      // No need to check isDemo here as it could be stale in the cleanup function
      // Just ensure localStorage is consistent with what we expect
      if (localStorage.getItem('demo_mode') === 'true') {
        console.log('Preserving demo mode state on cleanup');
      }
    };
  }, [isDemo, enterDemoMode, exitDemoMode]);
  
  // Sample demo data
  const demoBalance = 1250.75;
  const demoIncome = 2000;
  const demoExpenses = 749.25;
  
  // Sample recent transactions
  const demoTransactions = [
    { id: 1, description: "Grocery Shopping", category: "food", type: "expense", amount: 85.50, date: "2023-10-15" },
    { id: 2, description: "Monthly Salary", category: "salary", type: "income", amount: 2000, date: "2023-10-10" },
    { id: 3, description: "Electricity Bill", category: "utilities", type: "expense", amount: 120, date: "2023-10-08" },
    { id: 4, description: "Online Shopping", category: "shopping", type: "expense", amount: 65.75, date: "2023-10-05" },
    { id: 5, description: "Coffee Shop", category: "food", type: "expense", amount: 12, date: "2023-10-03" },
  ];

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper function to get emoji icon for category
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: "🍔",
      transportation: "🚗",
      utilities: "💡",
      entertainment: "🎬",
      shopping: "🛍️",
      health: "🏥",
      education: "📚",
      other: "📦",
      salary: "💰",
      investments: "📈",
      gifts: "🎁",
    };
    return icons[category] || "📝";
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Demo Mode</h1>
            <p className="text-muted-foreground">This is a preview of MiniFin with sample data</p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-yellow-500/10 text-yellow-500 p-2 rounded-md text-sm">
              <p>Feel free to explore all pages in demo mode!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="bg-[#09122C] hover:bg-[#1a2344] border border-[#BE3144]/30">
                <Link href="/" className="flex items-center gap-1">
                  Return Home
                </Link>
              </Button>
              <Button className="bg-[#BE3144] hover:bg-[#872341]">
                <Link href="/pincode" className="flex items-center gap-1">
                  Access Real Data
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-[#BE3144]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(demoBalance)}</div>
              <div className="mt-2 flex items-center text-xs text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" /> 
                <span>+2.5% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-[#BE3144]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(demoIncome)}</div>
              <div className="mt-2 flex items-center text-xs text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" /> 
                <span>+5% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-[#BE3144]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(demoExpenses)}</div>
              <div className="mt-2 flex items-center text-xs text-red-500">
                <ArrowDownRight className="h-4 w-4 mr-1" /> 
                <span>+3% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-[#BE3144]/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">Try navigating to these pages in demo mode:</p>
                <div className="flex flex-wrap gap-2">
                  <DemoLink href="/transactions" className="px-3 py-2 rounded-md bg-[#BE3144]/10 hover:bg-[#BE3144]/20 text-white">
                    Transactions
                  </DemoLink>
                  <DemoLink href="/analytics" className="px-3 py-2 rounded-md bg-[#BE3144]/10 hover:bg-[#BE3144]/20 text-white">
                    Analytics
                  </DemoLink>
                  <DemoLink href="/settings" className="px-3 py-2 rounded-md bg-[#BE3144]/10 hover:bg-[#BE3144]/20 text-white">
                    Settings
                  </DemoLink>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-[#BE3144]/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>About Demo Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Demo mode uses mock data and doesn't connect to Firebase. 
                You can explore all app features without authentication.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="mb-4 bg-[#09122C] border border-[#BE3144]/30">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-[#872341] data-[state=active]:text-white">
              Recent Transactions
            </TabsTrigger>
            <TabsTrigger value="spending" className="data-[state=active]:bg-[#872341] data-[state=active]:text-white">
              Spending by Category
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <div className="bg-amber-500/20 text-amber-500 py-1 px-2 rounded-md text-xs flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Demo Data
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b border-[#BE3144]/10 pb-4"
                    >
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-[#09122C] p-2">
                          <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        transaction.type === "income" ? "text-green-500" : "text-[#E17564]"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="spending" className="space-y-4">
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center py-8 text-muted-foreground">
                    Chart visualization available in full version
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
} 