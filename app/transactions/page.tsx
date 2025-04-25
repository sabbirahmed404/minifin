"use client";

import { useState } from "react";
import { useFinance } from "../lib/data/FinanceContext";
import { useCurrency } from "../lib/data/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistance } from "date-fns";
import { Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import AppLayout from "../AppLayout";

export default function TransactionsPage() {
  const { transactions, deleteTransaction, isLoading } = useFinance();
  const { formatCurrency } = useCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter transactions by search query
  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.description.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query)
    );
  });
  
  // Sort transactions by date (newest first)
  filteredTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
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
  
  // Function to handle transaction deletion
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setIsDeleting(true);
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error("Error deleting transaction:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <Button 
            className="bg-[#BE3144] hover:bg-[#872341]"
            disabled={isLoading || isDeleting}
            asChild
          >
            <Link href="/transactions/new" className="flex items-center gap-1 text-white">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Link>
          </Button>
        </div>
        
        <Card className="bg-card border-[#BE3144]/30 mb-6">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex mb-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background border-[#BE3144]/30"
                />
              </div>
            </div>
            
            {/* Show loading state or transactions table */}
            {isLoading || isDeleting ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BE3144]"></div>
              </div>
            ) : (
              <>
                {filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{getCategoryIcon(transaction.category)}</span>
                              <span className="capitalize">{transaction.category}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span title={new Date(transaction.date).toLocaleDateString()}>
                              {formatDistance(new Date(transaction.date), new Date(), {
                                addSuffix: true,
                              })}
                            </span>
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${
                              transaction.type === "income"
                                ? "text-green-500"
                                : "text-[#E17564]"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-[#BE3144]/10"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background border-[#BE3144]/30">
                                <DropdownMenuItem asChild>
                                  <Link 
                                    href={`/transactions/edit/${transaction.id}`}
                                    className="flex items-center cursor-pointer"
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(transaction.id)}
                                  className="text-red-500 focus:text-red-500 flex items-center cursor-pointer"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery
                      ? "No transactions found matching your search."
                      : "No transactions yet. Add your first transaction to get started."}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 