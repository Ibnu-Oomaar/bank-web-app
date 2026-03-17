"use client"

import React from 'react'
import { Card, Button } from '@/design-system/components'
import { 
  Users, 
  Activity, 
  ShieldAlert, 
  BarChart3, 
  ArrowUpRight, 
  AlertCircle,
  MoreHorizontal
} from 'lucide-react'

import { useAdminStats } from '@/hooks/use-api'

export default function AdminPage() {
  const { data: stats, isLoading } = useAdminStats()

  const adminStats = [
    { label: 'Total Users', value: stats?.userCount?.toLocaleString() || '0', change: 'Live', icon: Users },
    { label: 'Total Platform Balance', value: `$${stats?.totalBalance?.toLocaleString() || '0'}`, change: 'All Wallets', icon: Activity },
    { label: 'Pending Loans', value: stats?.pendingLoans?.toString() || '0', change: 'Review Required', icon: ShieldAlert },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
          <p className="text-muted-foreground font-medium">Monitoring engine and platform-wide control center.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent text-foreground cursor-pointer">Download System Log</Button>
          <Button size="sm">Platform Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-32 animate-pulse bg-white/5"><div /></Card>)
        ) : adminStats.map((stat) => (
          <Card key={stat.label} className="border-l-4 border-l-primary/50">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h4 className="text-3xl font-black">{stat.value}</h4>
                <p className="text-xs text-primary font-bold">{stat.change}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Platform Performance
            </h3>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-lg relative group h-full cursor-pointer overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 w-full bg-primary/40 group-hover:bg-primary/80 transition-all rounded-t-lg" 
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
            <span>Mar 06</span>
            <span>Mar 16</span>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Security Audit
            </h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  <div>
                    <h5 className="font-bold text-sm">Failed login attempt from ID: 192.168.1.{i}</h5>
                    <p className="text-[10px] text-muted-foreground font-medium">User: admin_test • 2 mins ago</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-white transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground hover:text-primary">
              View Detailed Audit Trail
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
