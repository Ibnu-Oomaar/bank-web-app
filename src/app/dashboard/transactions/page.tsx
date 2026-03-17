"use client"

import React, { useState } from 'react'
import { Card, Input } from '@/design-system/components'
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'

import { useTransactions } from '@/hooks/use-api'
import { format } from 'date-fns'

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: transactions, isLoading } = useTransactions()

  const filteredTransactions = transactions?.filter(tx => 
    tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Keep track of all your incoming and outgoing funds.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-white/5 text-foreground cursor-pointer bg-transparent">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-border rounded-lg text-sm font-medium hover:bg-white/10 text-foreground cursor-pointer">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-white/5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              placeholder="Search by transaction type, ID or status..." 
              className="w-full bg-background/50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-border">
                <th className="px-6 py-4">Transaction</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Account ID</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4 h-16 bg-white/2 border-0"></td>
                  </tr>
                ))
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{tx.type}</p>
                          <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">{tx.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {tx.status === 'COMPLETED' ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        ) : (
                          <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></div>
                        )}
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          tx.status === 'COMPLETED' ? 'text-emerald-500' : 
                          tx.status === 'PENDING' ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{format(new Date(tx.createdAt), 'hh:mm a')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground truncate max-w-[100px] inline-block">
                        {tx.walletId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`font-black text-sm ${tx.amount > 0 ? 'text-emerald-500' : 'text-foreground'}`}>
                        {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border bg-white/2 flex justify-between items-center text-xs text-muted-foreground font-medium">
          <p>Showing {filteredTransactions.length} transactions</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors text-foreground cursor-pointer">Previous</button>
            <button className="px-3 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors text-foreground cursor-pointer">Next</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
