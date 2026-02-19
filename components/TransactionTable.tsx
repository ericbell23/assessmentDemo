'use client';

import { Transaction, HIGH_VALUE_THRESHOLD } from '@/lib/types';
import { clearFunds } from '@/lib/api';
import { useState } from 'react';

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionUpdate: (id: string, updated: Transaction) => void;
  superAdminMode?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export default function TransactionTable({ 
  transactions, 
  onTransactionUpdate,
  superAdminMode = false,
  selectedIds = new Set(),
  onSelectionChange,
}: TransactionTableProps) {

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  

  const handleClearFunds = async (transaction: Transaction) => {
    setProcessingIds(prev => new Set(prev).add(transaction.id));
    
    try {
      await clearFunds(transaction.id);
      onTransactionUpdate(transaction.id, {
        ...transaction,
        status: 'Cleared',
      });
    } catch (error) {
      console.error('Failed to clear funds:', error);
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(transaction.id);
        return next;
      });
    }
  };

  const isHighValue = (amount: number) => amount > HIGH_VALUE_THRESHOLD;
  const isLocked = (tx: Transaction) => isHighValue(tx.amount) && !superAdminMode;
  const canSelect = (tx: Transaction) => tx.status === 'Pending' && !isLocked(tx);

  const selectableTransactions = transactions.filter(canSelect);
  const allSelectableSelected = selectableTransactions.length > 0 && 
    selectableTransactions.every(tx => selectedIds.has(tx.id));

  const handleSelectAll = (checked: boolean) => {
    selectableTransactions.forEach(tx => {
      onSelectionChange?.(tx.id, checked);
    });
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      Pending: 'bg-amber-100 text-amber-700 border-amber-200',
      Cleared: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Failed: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                checked={allSelectableSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Transaction ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {transactions.map((tx) => {
            const highValue = isHighValue(tx.amount);
            const locked = isLocked(tx);
            const selectable = canSelect(tx);
            const isProcessing = processingIds.has(tx.id);
            
            return (
              <tr 
                key={tx.id}
                className={`hover:bg-slate-50 transition-colors ${
                  highValue ? 'bg-red-50/50 border-l-4 border-l-red-500' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {selectable && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(tx.id)}
                      onChange={(e) => onSelectionChange?.(tx.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono font-medium text-slate-900">{tx.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{tx.clientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(tx.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">
                    {new Date(tx.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {tx.status === 'Pending' && (
                    <button
                      onClick={() => handleClearFunds(tx)}
                      disabled={isProcessing || locked}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                      title={locked ? 'High-value transactions require Super Admin mode' : ''}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                        </>
                      ) : (
                        'Clear Funds'
                      )}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}