import { Transaction } from './types';

export async function clearFunds(transactionId: string): Promise<Transaction> {
  // Simulate 1.5 second API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 10% chance of failure
  if (Math.random() < 0.1) {
    throw new Error(`Failed to clear funds for ${transactionId}`);
  }
  
  // Return updated transaction (in real app, this would be an API call)
  return {
    id: transactionId,
    clientName: '', // Will be merged with existing
    amount: 0,
    status: 'Cleared',
    timestamp: new Date(),
  };
}