"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  addTransaction as addFirestoreTransaction,
  updateTransaction as updateFirestoreTransaction,
  deleteTransaction as deleteFirestoreTransaction,
  getAllTransactions,
  syncTransactionsToFirestore
} from "../firebase/firestore";

export type TransactionType = "income" | "expense";
export type CategoryType = "food" | "transportation" | "utilities" | "entertainment" | "shopping" | "health" | "education" | "other" | "salary" | "investments" | "gifts";
export type TimeFilterOption = "7days" | "month" | "year" | "all";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
  category: CategoryType;
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  editTransaction: (id: string, transaction: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByCategory: (category: CategoryType) => Transaction[];
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  getFilteredTransactions: (filterOption: TimeFilterOption) => Transaction[];
  isFirestoreSynced: boolean;
  syncWithFirestore: () => Promise<boolean>;
  loadFromFirestore: () => Promise<boolean>;
  isLoading: boolean;
}

// Sample transactions for development
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    amount: 2500,
    description: "Monthly Salary",
    date: new Date().toISOString(),
    type: "income",
    category: "salary"
  },
  {
    id: "2",
    amount: 150,
    description: "Grocery Shopping",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: "expense",
    category: "food"
  },
  {
    id: "3",
    amount: 200,
    description: "Electricity Bill",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: "expense",
    category: "utilities"
  },
  {
    id: "4",
    amount: 500,
    description: "Freelance Work",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: "income",
    category: "other"
  },
  {
    id: "5",
    amount: 80,
    description: "Movie Night",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: "expense",
    category: "entertainment"
  }
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

// Check if we're in development mode with mock Firebase
const isMockMode = 
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key';

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFirestoreSynced, setIsFirestoreSynced] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load data on mount (client-side only)
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if Firestore sync flag is set in localStorage
        const syncStatus = localStorage.getItem("firestore_synced");
        const wasPreviouslySynced = syncStatus ? JSON.parse(syncStatus) : false;
        
        // If mock mode, use sample data or localStorage
        if (isMockMode) {
          const savedTransactions = localStorage.getItem("finance_transactions");
          if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
          } else {
            setTransactions(SAMPLE_TRANSACTIONS);
          }
          setIsLoading(false);
          return;
        }
        
        // Not in mock mode, attempt to load from Firestore first
        try {
          console.log('Attempting to load data from Firestore...');
          const firestoreTransactions = await getAllTransactions();
          
          if (firestoreTransactions && firestoreTransactions.length > 0) {
            console.log(`Loaded ${firestoreTransactions.length} transactions from Firestore`);
            setTransactions(firestoreTransactions);
            setIsFirestoreSynced(true);
          } else if (wasPreviouslySynced) {
            // If previously synced but no data found, keep Firebase sync status
            console.log('No transactions found in Firestore, but keeping sync status');
            setIsFirestoreSynced(true);
            
            // Check localStorage as fallback
            const savedTransactions = localStorage.getItem("finance_transactions");
            if (savedTransactions) {
              setTransactions(JSON.parse(savedTransactions));
            }
          } else {
            // If not previously synced and no Firestore data, use localStorage
            console.log('Falling back to localStorage data');
            const savedTransactions = localStorage.getItem("finance_transactions");
            if (savedTransactions) {
              setTransactions(JSON.parse(savedTransactions));
            } else {
              // No localStorage data either, use sample data
              setTransactions(SAMPLE_TRANSACTIONS);
            }
          }
        } catch (firestoreError) {
          console.error('Error loading from Firestore:', firestoreError);
          
          // On error, fall back to localStorage
          const savedTransactions = localStorage.getItem("finance_transactions");
          if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
          } else {
            setTransactions(SAMPLE_TRANSACTIONS);
          }
          
          // Reset Firestore sync status on persistent error
          setIsFirestoreSynced(false);
        }
      } catch (error) {
        console.error("Failed to initialize data:", error);
        // Final fallback
        setTransactions(SAMPLE_TRANSACTIONS);
        setIsFirestoreSynced(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);
  
  // Save to localStorage as backup when transactions change
  useEffect(() => {
    try {
      localStorage.setItem("finance_transactions", JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transactions to localStorage:", error);
    }
  }, [transactions]);
  
  // Save Firestore sync status to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("firestore_synced", JSON.stringify(isFirestoreSynced));
    } catch (error) {
      console.error("Failed to save Firestore sync status to localStorage:", error);
    }
  }, [isFirestoreSynced]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      setIsLoading(true);
      let id: string;
      
      if (!isMockMode) {
        // Add to Firestore first
        try {
          id = await addFirestoreTransaction(transaction);
        } catch (error) {
          console.error("Failed to add transaction to Firestore:", error);
          // Fall back to local ID if Firestore fails
          id = crypto.randomUUID();
        }
      } else {
        // In mock mode, generate local ID
        id = crypto.randomUUID();
      }
      
      const newTransaction = {
        ...transaction,
        id,
      };
      
      setTransactions((prev) => [...prev, newTransaction]);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to add transaction:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const editTransaction = async (id: string, transaction: Omit<Transaction, "id">) => {
    try {
      setIsLoading(true);
      const updatedTransaction = { ...transaction, id };
      
      if (!isMockMode) {
        // Update in Firestore first
        try {
          await updateFirestoreTransaction(id, transaction);
        } catch (error) {
          console.error("Failed to update transaction in Firestore:", error);
          // Continue with local update even if Firestore fails
        }
      }
      
      setTransactions((prev) => 
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to update transaction:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setIsLoading(true);
      
      if (!isMockMode) {
        // Delete from Firestore first
        try {
          await deleteFirestoreTransaction(id);
        } catch (error) {
          console.error("Failed to delete transaction from Firestore:", error);
          // Continue with local deletion even if Firestore fails
        }
      }
      
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const getTransactionsByType = (type: TransactionType) => {
    return transactions.filter((t) => t.type === type);
  };

  const getTransactionsByCategory = (category: CategoryType) => {
    return transactions.filter((t) => t.category === category);
  };

  const getTransactionsByMonth = (month: number, year: number) => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };
  
  const getFilteredTransactions = (filterOption: TimeFilterOption) => {
    const now = new Date();
    
    switch (filterOption) {
      case "7days": {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return transactions.filter(t => new Date(t.date) >= sevenDaysAgo);
      }
      case "month": {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
      }
      case "year": {
        const currentYear = now.getFullYear();
        return transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
      }
      case "all":
      default:
        return transactions;
    }
  };
  
  // Function to sync current data to Firestore
  const syncWithFirestore = async (): Promise<boolean> => {
    if (isMockMode) {
      console.log("Mock mode: Simulating Firestore sync");
      setIsFirestoreSynced(true);
      setIsLoading(false);
      return true;
    }
    
    try {
      setIsLoading(true);
      console.log("Syncing data to Firestore...");
      
      // Get current Firestore transactions to avoid duplicates
      const firestoreTransactions = await getAllTransactions();
      const firestoreIds = new Set(firestoreTransactions.map(t => t.id));
      
      // Filter local transactions that don't exist in Firestore
      const localOnlyTransactions = transactions.filter(t => !firestoreIds.has(t.id));
      
      if (localOnlyTransactions.length > 0) {
        console.log(`Syncing ${localOnlyTransactions.length} local transactions to Firestore...`);
        // Only sync transactions that don't already exist in Firestore
        const success = await syncTransactionsToFirestore(localOnlyTransactions);
        if (success) {
          console.log("Successfully synced local transactions to Firestore");
          setIsFirestoreSynced(true);
          setIsLoading(false);
          return true;
        } else {
          console.error("Failed to sync local transactions to Firestore");
          setIsLoading(false);
          return false;
        }
      } else {
        console.log("No new local transactions to sync to Firestore");
        setIsFirestoreSynced(true);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Failed to sync with Firestore:", error);
      setIsLoading(false);
      return false;
    }
  };
  
  // Function to load data from Firestore, replacing local data
  const loadFromFirestore = async (): Promise<boolean> => {
    if (isMockMode) {
      console.log("Mock mode: Simulating Firestore data load");
      setIsFirestoreSynced(true);
      return true;
    }
    
    try {
      setIsLoading(true);
      console.log("Loading data from Firestore...");
      
      const firestoreTransactions = await getAllTransactions();
      
      if (firestoreTransactions && firestoreTransactions.length > 0) {
        console.log(`Loaded ${firestoreTransactions.length} transactions from Firestore`);
        // Replace local data with Firestore data
        setTransactions(firestoreTransactions);
        setIsFirestoreSynced(true);
        setIsLoading(false);
        return true;
      } else {
        console.log("No transactions found in Firestore");
        // If no data in Firestore but we already have local data, offer to sync
        if (transactions.length > 0) {
          console.log("Local transactions exist, keeping them");
        }
        setIsFirestoreSynced(true);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Failed to load data from Firestore:", error);
      // Don't change local data if Firestore load fails
      setIsFirestoreSynced(false);
      setIsLoading(false);
      return false;
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const value = {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalBalance,
    totalIncome,
    totalExpenses,
    getTransactionsByType,
    getTransactionsByCategory,
    getTransactionsByMonth,
    getFilteredTransactions,
    isFirestoreSynced,
    syncWithFirestore,
    loadFromFirestore,
    isLoading
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}; 