'use client';

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { generateMockTransactions } from '@/lib/mockData';
import TransactionTable from '@/components/TransactionTable';
import SuperAdminToggle from '@/components/SuperAdminToggle';
import BatchActions from '@/components/BatchActions';
import { useLiveFeed } from '@/hooks/useLiveFeed';

export default function Home() {
  const [superAdminMode, setSuperAdminMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { transactions, updateTransaction } = useLiveFeed(
    generateMockTransactions(50)
  );

  const handleTransactionUpdate = (id: string, updated: Transaction) => {
    updateTransaction(id, updated);
  };

  const handleSelectionChange = (id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleBatchComplete = (results: Map<string, { success: boolean; transaction?: Transaction }>) => {
    results.forEach((result, id) => {
      if (result.success && result.transaction) {
        updateTransaction(id, result.transaction);
      } else if (result.transaction) {
        const original = transactions.find(tx => tx.id === id);
        if (original) {
          updateTransaction(id, { ...original, status: 'Failed' });
        }
      }
    });
  };

  const pendingCount = transactions.filter(tx => tx.status === 'Pending').length;
  const clearedCount = transactions.filter(tx => tx.status === 'Cleared').length;
  const failedCount = transactions.filter(tx => tx.status === 'Failed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Settlement Monitoring
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Real-time transaction settlement dashboard
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
                  Total Transactions
                </div>
                <div className="text-2xl font-semibold text-slate-900">
                  {transactions.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Cleared</p>
                <p className="text-3xl font-bold text-emerald-600">{clearedCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-600">{failedCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Super Admin Toggle */}
        <SuperAdminToggle 
          isEnabled={superAdminMode} 
          onToggle={setSuperAdminMode} 
        />

        {/* Transaction Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <TransactionTable 
            transactions={transactions} 
            onTransactionUpdate={handleTransactionUpdate}
            superAdminMode={superAdminMode}
            selectedIds={selectedIds}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        {/* Batch Actions */}
        <BatchActions
          selectedIds={selectedIds}
          transactions={transactions}
          onBatchComplete={handleBatchComplete}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      </main>
    </div>
  );
}