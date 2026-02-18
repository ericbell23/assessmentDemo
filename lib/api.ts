import { Transaction } from './types';

export async function clearFunds(transactionId: string): Promise<Transaction> {
  // Simulate 1.5 second API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return updated transaction (in real app, this would be an API call)
  return {
    id: transactionId,
    clientName: '', // Will be merged with existing
    amount: 0,
    status: 'Cleared',
    timestamp: new Date(),
  };
}