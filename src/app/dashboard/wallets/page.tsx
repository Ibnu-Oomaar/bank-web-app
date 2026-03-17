"use client"

import React from 'react'
import { Card, Button } from '@/design-system/components'
import { Plus, CreditCard, Landmark, Wallet as WalletIcon, MoreVertical } from 'lucide-react'

import { useWallet } from '@/hooks/use-api'

export default function WalletsPage() {
  const { data: wallet, isLoading } = useWallet()

  const displayWallets = wallet ? [
    { 
      id: 'primary-wallet', 
      name: 'Main Wallet', 
      type: 'Standard Account', 
      balance: `$${wallet.balance.toLocaleString()}`, 
      currency: 'USD', 
      status: 'Primary' 
    }
  ] : []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wallets</h1>
          <p className="text-muted-foreground">Manage your multiple secondary accounts and savings.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Wallet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2].map(i => <Card key={i} className="h-64 animate-pulse bg-white/5"><div /></Card>)
        ) : displayWallets.length > 0 ? (
          displayWallets.map((wallet) => (
            <Card key={wallet.id} className="relative group overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300">
              <div className="flex flex-col h-full space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <WalletIcon className="w-6 h-6" />
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-full border-0 bg-transparent cursor-pointer"><MoreVertical className="w-4 h-4" /></button>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{wallet.name}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">{wallet.type}</p>
                </div>

                <div>
                  <h2 className="text-3xl font-black">{wallet.balance}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] py-0.5 px-2 bg-emerald-500/10 text-emerald-500 rounded-full font-bold">
                      {wallet.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold">{wallet.currency}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Deposit</Button>
                  <Button variant="outline" size="sm" className="flex-1">Transfer</Button>
                </div>
              </div>
              
              {/* Design accents */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 bg-white/5 rounded-2xl border-2 border-dashed border-border flex flex-col items-center gap-4">
            <WalletIcon className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground font-medium">No wallets found. Create one to get started.</p>
          </div>
        )}
        
        {/* Placeholder for adding wallet */}
        <button className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:bg-white/5 hover:border-primary/50 transition-all group bg-transparent cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold">Create New Wallet</span>
        </button>
      </div>
    </div>
  )
}
