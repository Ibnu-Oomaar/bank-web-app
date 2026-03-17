"use client"

import React from 'react'
import { Card } from '@/design-system/components'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign
} from 'lucide-react'

import Link from 'next/link'
import { useWallet, useTransactions } from '@/hooks/use-api'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { data: transactions, isLoading: txLoading } = useTransactions()

  const stats = [
    { 
      label: 'Total Balance', 
      value: walletLoading ? '...' : `$${wallet?.balance.toLocaleString()}`, 
      change: '+0.0%', 
      icon: DollarSign, 
      trend: 'up' 
    },
    { label: 'Monthly Income', value: '$0.00', change: '+0.0%', icon: TrendingUp, trend: 'up' }, // Future: calculate from tx
    { label: 'Monthly Expenses', value: '$0.00', change: '-0.0%', icon: TrendingDown, trend: 'down' }, // Future: calculate from tx
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-center gap-2">
                <h4 className="text-2xl font-bold">{stat.value}</h4>
                <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            <Link href="/dashboard/transactions" className="text-sm text-primary hover:underline font-medium">View all</Link>
          </div>
          <div className="space-y-4">
            {txLoading ? (
               <div className="flex flex-col gap-4">
                 {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl"></div>)}
               </div>
            ) : transactions && transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h5 className="font-semibold">{tx.type}</h5>
                      <p className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), 'MMM dd, yyyy • hh:mm a')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-foreground'}`}>
                      {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{tx.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-10 italic">No transactions found</p>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-primary/10 border-primary/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-bold">Quick Transfer</h3>
              <p className="text-sm text-muted-foreground">Send money instantly to anyone worldwide using their email.</p>
              <Link href="/dashboard/payments">
                <button className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 transition-all group-hover:scale-[1.02] border-0 cursor-pointer">
                  New Transfer
                </button>
              </Link>
            </div>
            <DollarSign className="absolute -bottom-4 -right-4 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors" />
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-bold">Loan Application</h3>
            <div className="p-4 border border-border rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Personal Loan</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">Low Interest</span>
              </div>
              <p className="text-xs text-muted-foreground">Up to $50,000 with 5.5% annual rate.</p>
            </div>
            <Link href="/dashboard/loans">
              <button className="w-full py-3 border border-border hover:bg-white/5 rounded-xl font-bold transition-all bg-transparent text-foreground cursor-pointer">
                Check Eligibility
              </button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
