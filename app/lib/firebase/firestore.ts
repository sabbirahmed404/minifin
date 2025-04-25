import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  DocumentData,
  serverTimestamp,
  setDoc,
  Firestore
} from 'firebase/firestore';
import { db } from './config';
import { Transaction } from '../data/FinanceContext';

const TRANSACTIONS_COLLECTION = 'transactions';

// Utility function to check if Firestore is available
const isFirestoreAvailable = (): boolean => {
  try {
    return !!db;
  } catch (error) {
    console.error('Firestore is not available:', error);
    return false;
  }
};

// Add a new transaction
export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<string> => {
  if (!isFirestoreAvailable()) {
    throw new Error('Firestore is not properly configured');
  }

  try {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      ...transaction,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Update an existing transaction
export const updateTransaction = async (id: string, transaction: Omit<Transaction, 'id'>): Promise<void> => {
  if (!isFirestoreAvailable()) {
    throw new Error('Firestore is not properly configured');
  }

  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, id);
    await updateDoc(transactionRef, {
      ...transaction,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  if (!isFirestoreAvailable()) {
    throw new Error('Firestore is not properly configured');
  }

  try {
    await deleteDoc(doc(db, TRANSACTIONS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Get all transactions
export const getAllTransactions = async (): Promise<Transaction[]> => {
  if (!isFirestoreAvailable()) {
    throw new Error('Firestore is not properly configured');
  }

  try {
    const transactionsQuery = query(
      collection(db, TRANSACTIONS_COLLECTION),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(transactionsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Transaction, 'id'>
    }));
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

// Get transactions by type
export const getTransactionsByType = async (type: 'income' | 'expense'): Promise<Transaction[]> => {
  try {
    const transactionsQuery = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('type', '==', type),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(transactionsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Transaction, 'id'>
    }));
  } catch (error) {
    console.error('Error getting transactions by type:', error);
    throw error;
  }
};

// Get transactions by category
export const getTransactionsByCategory = async (category: string): Promise<Transaction[]> => {
  try {
    const transactionsQuery = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where('category', '==', category),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(transactionsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Transaction, 'id'>
    }));
  } catch (error) {
    console.error('Error getting transactions by category:', error);
    throw error;
  }
};

// Get transactions by month and year
export const getTransactionsByMonth = async (month: number, year: number): Promise<Transaction[]> => {
  try {
    // This is a client-side filtering approach since Firestore doesn't directly support
    // filtering by parts of a date. In a production app, you might want to store
    // month and year as separate fields for more efficient querying.
    const allTransactions = await getAllTransactions();
    
    return allTransactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  } catch (error) {
    console.error('Error getting transactions by month:', error);
    throw error;
  }
};

// Sync local transactions to Firestore
export const syncTransactionsToFirestore = async (transactions: Transaction[]): Promise<boolean> => {
  if (!isFirestoreAvailable()) {
    console.warn('Firestore is not properly configured, cannot sync');
    return false;
  }

  try {
    console.log(`Syncing ${transactions.length} transactions to Firestore...`);
    
    // Batch operations would be more efficient for large datasets
    for (const transaction of transactions) {
      const { id, ...data } = transaction;
      await setDoc(doc(db, TRANSACTIONS_COLLECTION, id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Transaction sync complete');
    return true;
  } catch (error) {
    console.error('Error syncing transactions to Firestore:', error);
    return false;
  }
}; 