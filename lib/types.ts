export type TransactionStatus = 'Pending' | 'Cleared' | 'Failed';

export interface Transaction {
  id: string;
  clientName: string;
  amount: number;
  status: TransactionStatus;
  timestamp: Date;
}

// Add this constant
export const HIGH_VALUE_THRESHOLD = 10000;