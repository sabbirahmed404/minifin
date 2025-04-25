"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFinance, Transaction, CategoryType } from "../lib/data/FinanceContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

// Form schema with CategoryType values
const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0" }),
  date: z.string().min(1, { message: "Date is required" }),
  type: z.enum(["income", "expense"]),
  category: z.enum([
    "food", "transportation", "utilities", "entertainment", 
    "shopping", "health", "education", "other", 
    "salary", "investments", "gifts"
  ]) as z.ZodEnum<[CategoryType, ...CategoryType[]]>,
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transactionId?: string;
  mode: "add" | "edit";
}

export default function TransactionForm({ transactionId, mode }: TransactionFormProps) {
  const router = useRouter();
  const { addTransaction, editTransaction, transactions, isLoading } = useFinance();
  const [submitting, setSubmitting] = useState(false);
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      category: "food",
    },
  });

  // Load existing transaction if editing
  useEffect(() => {
    if (mode === "edit" && transactionId) {
      const transaction = transactions.find((t) => t.id === transactionId);
      if (transaction) {
        form.reset({
          description: transaction.description,
          amount: transaction.amount,
          date: new Date(transaction.date).toISOString().split("T")[0],
          type: transaction.type,
          category: transaction.category,
        });
      }
    }
  }, [transactionId, mode, transactions, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      
      if (mode === "edit" && transactionId) {
        await editTransaction(transactionId, { ...data });
      } else {
        await addTransaction({ ...data });
      }
      
      router.push("/transactions");
    } catch (error) {
      console.error("Error submitting transaction:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const incomeCategories = [
    { label: "Salary", value: "salary" },
    { label: "Investments", value: "investments" },
    { label: "Gifts", value: "gifts" },
    { label: "Other", value: "other" },
  ];

  const expenseCategories = [
    { label: "Food", value: "food" },
    { label: "Transportation", value: "transportation" },
    { label: "Utilities", value: "utilities" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Shopping", value: "shopping" },
    { label: "Health", value: "health" },
    { label: "Education", value: "education" },
    { label: "Other", value: "other" },
  ];

  return (
    <Card className="bg-card border-[#BE3144]/30">
      <CardHeader>
        <CardTitle>
          {mode === "add" ? "Add New Transaction" : "Edit Transaction"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What's this transaction for?" 
                      {...field} 
                      className="bg-background border-[#BE3144]/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      className="bg-background border-[#BE3144]/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      className="bg-background border-[#BE3144]/30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background border-[#BE3144]/30">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background">
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                const categories =
                  form.watch("type") === "income"
                    ? incomeCategories
                    : expenseCategories;

                return (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background border-[#BE3144]/30">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background">
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/transactions")}
                className="border-[#BE3144]/30"
                disabled={submitting || isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#BE3144] hover:bg-[#872341]"
                disabled={submitting || isLoading}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "add" ? "Adding..." : "Saving..."}
                  </>
                ) : (
                  mode === "add" ? "Add Transaction" : "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 