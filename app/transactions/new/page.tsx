"use client";

import TransactionForm from "@/components/TransactionForm";
import AppLayout from "../../AppLayout";

export default function AddTransaction() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6"></h1>
        <TransactionForm mode="add" />
      </div>
    </AppLayout>
  );
} 