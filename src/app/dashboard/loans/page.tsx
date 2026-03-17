"use client"

import React from 'react'
import { Card, Button, Input } from '@/design-system/components'
import { Landmark, Briefcase, Home, Car, Handshake, ChevronRight, Calculator } from 'lucide-react'

import { useLoans, useLoanProducts, useApplyLoanMutation } from '@/hooks/use-api'
import { format } from 'date-fns'

export default function LoansPage() {
  const { data: products, isLoading: productsLoading } = useLoanProducts()
  const { data: activeLoans, isLoading: loansLoading } = useLoans()
  const applyMutation = useApplyLoanMutation()

  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null)
  const [amount, setAmount] = React.useState('')
  const [term, setTerm] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !amount || !term) return
    
    try {
      await applyMutation.mutateAsync({
        productId: selectedProduct,
        amount: Number(amount),
        termMonths: Number(term)
      })
      alert('Application submitted successfully!')
      setAmount('')
      setTerm('')
      setSelectedProduct(null)
    } catch (err: any) {
      alert(err.message || 'Failed to submit application')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Services</h1>
          <p className="text-muted-foreground font-medium">Accessible and transparent credit solutions for your goals.</p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Calculator className="w-4 h-4" />
          Loan Calculator
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsLoading ? (
          [1, 2, 3, 4].map(i => <Card key={i} className="h-40 animate-pulse bg-white/5"><div /></Card>)
        ) : products?.map((p: any) => (
          <Card 
            key={p.id} 
            onClick={() => setSelectedProduct(p.id)}
            className={`group hover:bg-white/5 transition-all cursor-pointer border-2 ${selectedProduct === p.id ? 'border-primary' : 'border-transparent'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-primary/10 text-primary group-hover:scale-110 transition-transform`}>
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">Starting at <span className="text-foreground font-bold">{p.interestRate}%</span> APR</p>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">${p.minAmount} - ${p.maxAmount}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold">New Loan Application</h3>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Select Loan Product</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {products?.map((p: any) => (
                  <button 
                    key={p.id} 
                    type="button" 
                    onClick={() => setSelectedProduct(p.id)}
                    className={`p-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedProduct === p.id ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary/50 bg-transparent text-foreground'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <Input 
              label="Requested Amount" 
              placeholder="e.g. 5000" 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Input 
              label="Loan Term (Months)" 
              placeholder="e.g. 24" 
              type="number" 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Purpose of Loan</label>
              <textarea placeholder="Tell us how you plan to use this fund..." className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/50 outline-none h-24 text-foreground" />
            </div>
            <Button 
              type="submit" 
              className="md:col-span-2 py-4 font-black"
              disabled={applyMutation.isPending || !selectedProduct}
            >
              {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </Card>

        <Card className="space-y-6 bg-linear-to-br from-card to-secondary/30 h-fit">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Active Loans</h3>
          </div>
          
          <div className="space-y-4">
            {loansLoading ? (
              <div className="h-20 bg-white/5 animate-pulse rounded-xl" />
            ) : activeLoans && activeLoans.length > 0 ? (
              activeLoans.map((loan: any) => (
                <div key={loan.id} className="p-4 border border-border rounded-xl bg-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{loan.product?.name || 'Loan'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                      loan.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-muted-foreground">Principal</p>
                      <p className="text-lg font-black">${loan.requestedAmount.toLocaleString()}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">{loan.termMonths} Months</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">You currently have no active loans. Applications normally take 24-48 hours for review.</p>
            )}
          </div>

          <div className="p-5 border border-border rounded-2xl bg-white/5 space-y-4 text-foreground">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Quick Tips</span>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-2 text-xs leading-relaxed">
                <span className="text-primary font-black">01</span>
                Keep your credit score healthy by paying on time.
              </li>
              <li className="flex gap-2 text-xs leading-relaxed">
                <span className="text-primary font-black">02</span>
                Early repayments can save you interest.
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
