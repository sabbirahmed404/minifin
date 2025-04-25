import { Transaction } from "../data/FinanceContext";

// Function to retrieve API key and base ID from environment variables
const getAirtableConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
  const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    throw new Error('Airtable API key or base ID not configured');
  }
  
  return { apiKey, baseId };
};

// Function to sync transactions to Airtable
export const syncTransactionsToAirtable = async (transactions: Transaction[]): Promise<boolean> => {
  try {
    const { apiKey, baseId } = getAirtableConfig();
    
    // Create records to be sent to Airtable
    const records = transactions.map(transaction => ({
      fields: {
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
      }
    }));
    
    // Make API request to Airtable
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records })
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync with Airtable:', error);
    return false;
  }
};

// Function to retrieve transactions from Airtable
export const getTransactionsFromAirtable = async (): Promise<Transaction[]> => {
  try {
    const { apiKey, baseId } = getAirtableConfig();
    
    // Make API request to Airtable
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/transactions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Airtable records to Transaction objects
    return data.records.map((record: any) => ({
      id: record.fields.id,
      amount: record.fields.amount,
      description: record.fields.description,
      date: record.fields.date,
      type: record.fields.type as "income" | "expense",
      category: record.fields.category,
    }));
  } catch (error) {
    console.error('Failed to fetch from Airtable:', error);
    return [];
  }
};

// Function to delete a transaction from Airtable
export const deleteTransactionFromAirtable = async (transactionId: string): Promise<boolean> => {
  try {
    const { apiKey, baseId } = getAirtableConfig();
    
    // First, we need to find the Airtable record ID for this transaction
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/transactions?filterByFormula={id}="${transactionId}"`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.records.length === 0) {
      console.warn(`Transaction with ID ${transactionId} not found in Airtable`);
      return false;
    }
    
    // Now delete the record using its Airtable record ID
    const airtableRecordId = data.records[0].id;
    const deleteResponse = await fetch(`https://api.airtable.com/v0/${baseId}/transactions/${airtableRecordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!deleteResponse.ok) {
      throw new Error(`Airtable API error: ${deleteResponse.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete from Airtable:', error);
    return false;
  }
}; 