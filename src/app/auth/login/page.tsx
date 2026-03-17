"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Input, Button } from '@/design-system/components'
import { loginSchema } from '@/utils/validators'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const validated = loginSchema.parse(data)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Login failed')
      }

      setAuth(result.data.user, result.data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-background to-background">
      <Card className="w-full max-w-md space-y-8 py-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold gradient-text tracking-tight">OOMAAR BANK</h1>
          <p className="text-muted-foreground">Welcome back, please sign in</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input name="email" type="email" label="Email Address" placeholder="john@example.com" required />
          <div className="space-y-1">
            <Input name="password" type="password" label="Password" placeholder="••••••••" required />
            <div className="flex justify-end">
              <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
          </div>
          
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            New to Oomaar Bank?{' '}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Join now
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
