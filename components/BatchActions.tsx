'use client';

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { clearFunds } from '@/lib/api';

interface BatchActionsProps {
  selectedIds: Set<string>;
  transactions: Transaction[];
  onBatchComplete: (results: Map<string, { success: boolean; transaction?: Transaction }>) => void;
  onClearSelection: () => void;
}

export default function BatchActions({
  selectedIds,
  transactions,
  onBatchComplete,
  onClearSelection,
}: BatchActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBatchClear = async () => {
    if (selectedIds.size === 0) return;

    setIsProcessing(true);
    const selectedTransactions = transactions.filter(tx => 
      selectedIds.has(tx.id) && tx.status === 'Pending'
    );

    const promises = selectedTransactions.map(async (tx) => {
      try {
        await clearFunds(tx.id);
        return {
          id: tx.id,
          success: true,
          transaction: { ...tx, status: 'Cleared' },
        };
      } catch (error) {
        return {
          id: tx.id,
          success: false,
          transaction: { ...tx, status: 'Failed' as const },
        };
      }
    });

    const results = await Promise.allSettled(promises);
    
    const resultMap = new Map<string, { success: boolean; transaction?: Transaction }>();
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        resultMap.set(result.value.id, {
          success: result.value.success,
          transaction: result.value.transaction as Transaction,
        });
      }
    });

    onBatchComplete(resultMap);
    setIsProcessing(false);
    onClearSelection();
  };

  if (selectedIds.size === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-4 bg-white shadow-xl rounded-xl p-5 border border-slate-200 min-w-[280px]">
        <div className="flex-1">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            Selected
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {selectedIds.size}
          </div>
        </div>
        <button
          onClick={handleBatchClear}
          disabled={isProcessing}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed font-medium transition-all shadow-sm hover:shadow-md"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Clear Selected'
          )}
        </button>
      </div>
    </div>
  );
}