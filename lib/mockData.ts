import { Transaction } from './types';

const clientNames = [
  'Acme Corp', 'TechStart Inc', 'Global Finance LLC', 'Digital Assets Co',
  'Blockchain Ventures', 'Crypto Exchange Ltd', 'Investment Partners',
  'Trading Firm XYZ', 'Capital Holdings', 'Merchant Bank'
];

export function generateMockTransactions(count: number = 50): Transaction[] {
  const transactions: Transaction[] = [];
  const statuses: Transaction['status'][] = ['Pending', 'Cleared', 'Failed'];
  
  for (let i = 0; i < count; i++) {
    const isLarge = Math.random() > 0.7; // 30% chance of large transaction
    const amount = isLarge
      ? Math.floor(Math.random() * 100000) + 10000 // $10k-$110k
      : Math.floor(Math.random() * 1000) + 100;   // $100-$1k
    
    transactions.push({
      id: `TXN-${String(i + 1).padStart(6, '0')}`,
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      amount,
      status: statuses[Math.floor(Math.random() * statuses.length)] as Transaction['status'],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
    });
  }
  
  return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}