"use client";

import { useState, useMemo } from "react";
import { useFinance } from "../lib/data/FinanceContext";
import { useCurrency } from "../lib/data/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  IncomeVsExpensesChart, 
  CategoryPieChart, 
  MonthlySummaryChart,
  getColorForCategory
} from "../components/analytics/AnalyticsCharts";
import AppLayout from "../AppLayout";

export default function Analytics() {
  const { transactions, totalBalance, totalIncome, totalExpenses } = useFinance();
  const { formatCurrency } = useCurrency();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "all">("month");
  
  // Mock for spending by category data
  const spendingByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === "expense")
      .forEach((transaction) => {
        if (categories[transaction.category]) {
          categories[transaction.category] += transaction.amount;
        } else {
          categories[transaction.category] = transaction.amount;
        }
      });
    
    // Sort by amount (highest first)
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalExpenses) * 100),
      }));
  }, [transactions, totalExpenses]);
  
  // Mock for income sources
  const incomeBySource = useMemo(() => {
    const sources: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === "income")
      .forEach((transaction) => {
        if (sources[transaction.category]) {
          sources[transaction.category] += transaction.amount;
        } else {
          sources[transaction.category] = transaction.amount;
        }
      });
    
    // Sort by amount (highest first)
    return Object.entries(sources)
      .sort((a, b) => b[1] - a[1])
      .map(([source, amount]) => ({
        source,
        amount,
        percentage: Math.round((amount / totalIncome) * 100),
      }));
  }, [transactions, totalIncome]);
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Select
          value={timeRange}
          onValueChange={(value) => 
            setTimeRange(value as "week" | "month" | "year" | "all")
          }
        >
          <SelectTrigger className="w-[150px] bg-[#09122C] border-[#BE3144]/30">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-[#BE3144]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-[#BE3144]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-[#BE3144]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {totalIncome > 0 
                ? `${Math.round((totalBalance / totalIncome) * 100)}% of income saved`
                : "No income recorded yet"
              }
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 bg-[#09122C] border border-[#BE3144]/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#872341] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-[#872341] data-[state=active]:text-white">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="income" className="data-[state=active]:bg-[#872341] data-[state=active]:text-white">
            Income
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Income vs Expenses Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomeVsExpensesChart 
                  transactions={transactions} 
                  timeRange={timeRange} 
                />
              </CardContent>
            </Card>
            
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlySummaryChart transactions={transactions} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryPieChart 
                  transactions={transactions} 
                  type="expense" 
                />
                
                <div className="mt-4 space-y-3">
                  {spendingByCategory.length > 0 ? (
                    spendingByCategory.map(({ category, amount, percentage }) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: getColorForCategory(category) }}
                            />
                            <span className="capitalize">{category}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(amount)}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-muted-foreground">
                      No expense data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Top Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions
                    .filter((t) => t.type === "expense")
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5)
                    .map((transaction) => (
                      <div key={transaction.id} className="flex justify-between">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {transaction.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#E17564]">
                            -{formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {transactions.filter((t) => t.type === "expense").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No expenses recorded yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="income" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Income Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryPieChart 
                  transactions={transactions} 
                  type="income" 
                />
                
                <div className="mt-4 space-y-3">
                  {incomeBySource.length > 0 ? (
                    incomeBySource.map(({ source, amount, percentage }) => (
                      <div key={source} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: getColorForCategory(source) }}
                            />
                            <span className="capitalize">{source}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(amount)}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-muted-foreground">
                      No income data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Top Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions
                    .filter((t) => t.type === "income")
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5)
                    .map((transaction) => (
                      <div key={transaction.id} className="flex justify-between">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {transaction.category}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#66BB6A]">
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {transactions.filter((t) => t.type === "income").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No income recorded yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
} 