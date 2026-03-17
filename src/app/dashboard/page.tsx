"use client"

import React from 'react'
import { Card, Button, Badge, Skeleton } from '@/design-system/components'
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  Users,
  ShieldAlert,
  Activity,
  ArrowRight
} from 'lucide-react'

import Link from 'next/link'
import { useWallet, useTransactions, useAdminStats } from '@/hooks/use-api'
import { format } from 'date-fns'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF'

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName}</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your account today.</p>
      </div>

      {isAdmin ? <AdminOverview /> : <CustomerOverview />}
    </div>
  )
}

function AdminOverview() {
  const { data: stats, isLoading } = useAdminStats()

  const adminStats = [
    { label: 'Total Users', value: stats?.userCount, icon: Users, description: 'Registered accounts' },
    { label: 'Platform Balance', value: stats?.totalBalance ? `$${stats.totalBalance.toLocaleString()}` : '$0', icon: Activity, description: 'Aggregate liquidity' },
    { label: 'Pending Loans', value: stats?.pendingLoans, icon: ShieldAlert, description: 'Awaiting review', alert: (stats?.pendingLoans || 0) > 0 },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)
        ) : (
          adminStats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.alert ? 'text-destructive' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold px-1">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full justify-between">
                Manage Users <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard/admin/loans">
              <Button variant="outline" className="w-full justify-between">
                Review Loan Requests <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-dashed">
          <div className="p-3 bg-muted rounded-full">
            <Activity className="w-6 h-6 text-muted-foreground" />
          </div>
          <h4 className="font-medium">System Health</h4>
          <p className="text-xs text-muted-foreground max-w-[200px]">All backend services are operational and running within normal parameters.</p>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-0">Operational</Badge>
        </Card>
      </div>
    </div>
  )
}

function CustomerOverview() {
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { data: transactions, isLoading: txLoading } = useTransactions()

  const stats = [
    { 
      label: 'Personal Balance', 
      value: walletLoading ? '...' : `$${wallet?.balance.toLocaleString()}`, 
      change: '+0.0%', 
      icon: DollarSign, 
      trend: 'up' 
    },
    { label: 'Monthly Income', value: '$0.00', change: '+0.0%', icon: TrendingUp, trend: 'up' },
    { label: 'Monthly Expenses', value: '$0.00', change: '-0.0%', icon: TrendingDown, trend: 'down' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge variant={stat.trend === 'up' ? 'secondary' : 'destructive'} className={stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-0' : ''}>
                {stat.change}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b">
            <h3 className="font-semibold">Recent Activity</h3>
            <Link href="/dashboard/transactions" className="text-xs text-primary hover:underline font-medium">View all</Link>
          </div>
          <div className="divide-y">
            {txLoading ? (
               <div className="p-6 space-y-4">
                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
               </div>
            ) : transactions && transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), 'MMM dd, hh:mm a')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-500' : ''}`}>
                      {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{tx.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-sm text-muted-foreground">No recent transactions</div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-primary text-primary-foreground">
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Transfer</h3>
              <p className="text-xs text-primary-foreground/70">Send money instantly to anyone worldwide using their email.</p>
              <Link href="/dashboard/payments" className="block">
                <Button variant="secondary" className="w-full">
                  New Transfer
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 space-y-4 border-dashed">
            <h3 className="font-semibold">Loan Eligibility</h3>
            <p className="text-xs text-muted-foreground">You are currently eligible for up to <span className="text-foreground font-bold">$50,000</span> in personal loans.</p>
            <Link href="/dashboard/loans" className="block">
              <Button variant="outline" className="w-full">
                Check Offers
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

