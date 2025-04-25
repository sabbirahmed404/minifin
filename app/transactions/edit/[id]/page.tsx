"use client";

import { useParams } from "next/navigation";
import TransactionForm from "@/components/TransactionForm";
import AppLayout from "../../../AppLayout";

export default function EditTransaction() {
  const params = useParams();
  const transactionId = params.id as string;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Transaction</h1>
        <TransactionForm mode="edit" transactionId={transactionId} />
      </div>
    </AppLayout>
  );
} 