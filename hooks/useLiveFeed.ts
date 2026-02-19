import { useState, useEffect, useRef, useCallback } from 'react';
import { Transaction } from '@/lib/types';
import { generateMockTransactions } from '@/lib/mockData';

export function useLiveFeed(initialTransactions: Transaction[]) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transactionIdCounter = useRef(50);

  useEffect(() => {
    // Add new transaction every 2 seconds
    intervalRef.current = setInterval(() => {
      const newTx = generateMockTransactions(1)[0];
      newTx.id = `TXN-${String(++transactionIdCounter.current).padStart(6, '0')}`;
      newTx.timestamp = new Date();
      newTx.status = 'Pending';
      
      // Add to the top of the list (most recent first)
      setTransactions(prev => [newTx, ...prev]);
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const updateTransaction = useCallback((id: string, updated: Transaction) => {
    setTransactions(prev =>
      prev.map(tx => tx.id === id ? updated : tx)
    );
  }, []);

  return { transactions, updateTransaction };
}