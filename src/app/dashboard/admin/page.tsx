"use client"

import React from 'react'
import { Card, Button, Badge, Skeleton } from '@/design-system/components'
import { 
  Users, 
  Activity, 
  ShieldAlert, 
  ArrowUpRight, 
  AlertCircle,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react'

import { useAdminStats } from '@/hooks/use-api'
import Link from 'next/link'

export default function AdminPage() {
  const { data: stats, isLoading } = useAdminStats()

  const adminStats = [
    { label: 'Total Users', value: stats?.userCount?.toLocaleString() || '0', icon: Users, description: 'Active platform accounts' },
    { label: 'Platform Balance', value: `$${stats?.totalBalance?.toLocaleString() || '0'}`, icon: Activity, description: 'Total wallet volume' },
    { label: 'Pending Loans', value: stats?.pendingLoans?.toString() || '0', icon: ShieldAlert, description: 'Requires immediate review', alert: (stats?.pendingLoans || 0) > 0 },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Overview</h1>
          <p className="text-sm text-muted-foreground font-medium">Monitoring engine and platform-wide control center.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Download Logs</Button>
          <Button size="sm">System Settings</Button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold px-1">Security Audit</h3>
              <p className="text-xs text-muted-foreground px-1">Recent system-level events and access logs.</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View all</Button>
          </div>
          <div className="divide-y">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-destructive animate-pulse' : 'bg-amber-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {i === 1 ? 'Failed administrative login' : 'New staff account created'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">192.168.1.{i} • {i * 5} mins ago</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase">{i === 1 ? 'Alert' : 'Info'}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Quick Management</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/dashboard/admin/users">
                <Button variant="secondary" className="w-full justify-between text-xs">
                  User Management <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/admin/loans">
                <Button variant="secondary" className="w-full justify-between text-xs">
                   Loan Processing <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard/admin/ledgers">
                <Button variant="secondary" className="w-full justify-between text-xs">
                  Platform Ledger <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 border-dashed">
            <Activity className="w-8 h-8 text-primary/40" />
             <div className="space-y-1">
               <h4 className="text-sm font-semibold">Service Status</h4>
               <p className="text-[10px] text-muted-foreground">Syncing with main ledger node...</p>
             </div>
             <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-0">Healthy</Badge>
          </Card>
        </div>
      </div>
    </div>
  )
}

