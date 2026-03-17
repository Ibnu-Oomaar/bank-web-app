"use client"

import React from 'react'
import { Card, Button, Input } from '@/design-system/components'
import { CreditCard, Rocket, ShieldCheck, Globe, Zap, ArrowRight, Apple, Play } from 'lucide-react'

import { useDepositMutation, useTransferMutation } from '@/hooks/use-api'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function PaymentsPage() {
  const depositMutation = useDepositMutation()
  const transferMutation = useTransferMutation()

  const [depositAmount, setDepositAmount] = React.useState('')
  const [transferData, setTransferData] = React.useState({ toWalletId: '', amount: '', note: '' })
  const [status, setStatus] = React.useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleDeposit = async () => {
    if (!depositAmount) return
    setStatus(null)
    try {
      const result = await depositMutation.mutateAsync({ 
        amount: Number(depositAmount),
        currency: 'usd'
      }) as any
      // In a real app, result.data.clientSecret would be used with Stripe SDK
      setStatus({ type: 'success', message: `Deposit session created for $${depositAmount}. Checking out...` })
      if (result.success && result.data?.url) {
        window.location.href = result.data.url
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Deposit failed' })
    }
  }

  const handleTransfer = async () => {
    if (!transferData.toWalletId || !transferData.amount) return
    setStatus(null)
    try {
      await transferMutation.mutateAsync({
        toWalletId: transferData.toWalletId,
        amount: Number(transferData.amount),
        note: transferData.note
      })
      setStatus({ type: 'success', message: 'Transfer completed successfully!' })
      setTransferData({ toWalletId: '', amount: '', note: '' })
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Transfer failed' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tighter">Payments & Deposits</h1>
          <p className="text-muted-foreground max-w-lg mx-auto font-medium">
            Seamlessly fund your account or send payments globally with enterprise-grade security.
          </p>
          
          {status && (
            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Deposit Component */}
          <Card className="p-8 space-y-6 relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Quick Deposit</h3>
            </div>
            
            <div className="space-y-4">
              <Input 
                label="Amount to Add" 
                placeholder="0.00" 
                type="number" 
                className="text-xl font-bold" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <div className="grid grid-cols-4 gap-2">
                {[10, 50, 100, 500].map(v => (
                  <button 
                    key={v} 
                    onClick={() => setDepositAmount(v.toString())}
                    className="py-2 border border-border rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all bg-transparent text-foreground cursor-pointer"
                  >
                    ${v}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                onClick={handleDeposit}
                isLoading={depositMutation.isPending}
                className="w-full py-4 font-black shadow-xl shadow-primary/20 group-hover:scale-[1.01]"
              >
                Pay with Stripe
              </Button>
              <div className="flex items-center justify-center gap-4 text-muted-foreground opacity-50">
                <Apple className="w-5 h-5" />
                <Play className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Secure Checkout</span>
              </div>
            </div>

            <Rocket className="absolute -bottom-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 rotate-12 transition-all pointer-events-none" />
          </Card>

          {/* Global Payment Card (Internal Transfer) */}
          <Card className="p-8 space-y-6 border-primary/20 bg-linear-to-br from-card to-primary/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/5 text-foreground rounded-2xl">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Local Transfer</h3>
            </div>

            <div className="space-y-4">
              <Input 
                label="Recipient Email / Wallet ID" 
                placeholder="email@example.com" 
                value={transferData.toWalletId}
                onChange={(e) => setTransferData({ ...transferData, toWalletId: e.target.value })}
              />
              <Input 
                label="Amount" 
                placeholder="0.00" 
                type="number" 
                value={transferData.amount}
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
              />
              <Input 
                label="Note (Optional)" 
                placeholder="Rent, Dinner, etc." 
                value={transferData.note}
                onChange={(e) => setTransferData({ ...transferData, note: e.target.value })}
              />
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleTransfer}
                isLoading={transferMutation.isPending}
                variant="outline"
                className="w-full group py-4 border-2 border-primary/20 hover:border-primary/50 rounded-2xl flex items-center justify-center gap-3 transition-all"
              >
                <span className="font-black uppercase tracking-tighter">Send Funds Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Saved Methods Placeholder */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold px-2">Saved Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 glass rounded-2xl border-2 border-primary/40 flex items-center gap-4">
              <div className="w-12 h-8 bg-black/20 rounded flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-sm tracking-tighter">•••• 4242</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Visa Preferred</p>
              </div>
            </div>
            <button className="p-6 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground hover:bg-white/5 transition-all group bg-transparent cursor-pointer">
              <span className="text-xs font-bold uppercase tracking-wider">Add Method</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
