"use client";

import { useState } from "react";
import { useFinance, TimeFilterOption } from "../lib/data/FinanceContext";
import { useCurrency } from "../lib/data/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Plus,
  Clock,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import AppLayout from "../AppLayout";
import LoadingOverlay from "../components/LoadingOverlay";
import { TimeFilter } from "../components/TimeFilter";

export default function Dashboard() {
  const { transactions, totalBalance, totalIncome, totalExpenses, getFilteredTransactions, isLoading } = useFinance();
  const { formatCurrency } = useCurrency();
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>("all");
  
  // Filtered transactions based on time period
  const filteredTransactions = getFilteredTransactions(timeFilter);
  
  // Total calculations based on filtered transactions
  const filteredIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const filteredExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Show only 5 most recent transactions
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get future expenses (expenses with dates in the future)
  const futureExpenses = transactions
    .filter(t => t.type === "expense" && new Date(t.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5); // Show only the 5 nearest future expenses
  
  const totalFutureExpenses = futureExpenses.reduce((sum, t) => sum + t.amount, 0);

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
      rent: "🏠",
      installments: "💸",
      insurance: "🛡️",
      taxes: "📋",
      subscriptions: "📱",
    };
    return icons[category] || "📝";
  };

  if (isLoading) {
    return <LoadingOverlay show={true} message="Loading your finances..." />;
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button className="bg-[#BE3144] hover:bg-[#872341]" asChild>
            <Link href="/transactions/new" className="flex items-center gap-1 text-white">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-[#BE3144]/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
              <div className="mt-2 flex items-center text-xs text-green-500">
                <ArrowUpRight className="h-4 w-4 mr-1" /> 
                <span>+2.5% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-[#BE3144]/30">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Income
              </CardTitle>
              <TimeFilter
                value={timeFilter}
                onChange={setTimeFilter}
                className="ml-auto"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(filteredIncome)}</div>
              <div className="mt-2 flex items-center text-xs text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" /> 
                <span>+5% from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-[#BE3144]/30">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expenses
              </CardTitle>
              <TimeFilter
                value={timeFilter}
                onChange={setTimeFilter}
                className="ml-auto"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(filteredExpenses)}</div>
              <div className="mt-2 flex items-center text-xs text-red-500">
                <ArrowDownRight className="h-4 w-4 mr-1" /> 
                <span>+3% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Future Expenses Card */}
        <Card className="bg-card border-[#BE3144]/30 mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <CardTitle className="font-medium">
                Future Expenses
              </CardTitle>
              <div className="text-xl font-bold hidden sm:block">{formatCurrency(totalFutureExpenses)}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {futureExpenses.length > 0 ? (
                futureExpenses.map((expense) => {
                  const daysRemaining = differenceInDays(new Date(expense.date), new Date());
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between border-b border-[#BE3144]/10 pb-3"
                    >
                      <div className="flex items-center">
                        <div className="mr-4 rounded-full bg-[#09122C] p-2">
                          <span className="text-xl">{getCategoryIcon(expense.category)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(expense.date), "PP")}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-medium text-[#E17564]">
                          -{formatCurrency(expense.amount)}
                        </div>
                        <div className="flex items-center text-xs text-amber-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming expenses scheduled.
                </div>
              )}
            </div>
            {/* Show total amount at bottom for mobile */}
            <div className="mt-4 text-right sm:hidden">
              <div className="text-xl font-bold">{formatCurrency(totalFutureExpenses)}</div>
            </div>
          </CardContent>
        </Card>
        
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
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
                              {format(new Date(transaction.date), "PP")}
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
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions yet. Add your first transaction to get started.
                    </div>
                  )}
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
                  {transactions.filter(t => t.type === 'expense').length > 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="text-center">Chart visualization will go here</div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No expense data available yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
} 