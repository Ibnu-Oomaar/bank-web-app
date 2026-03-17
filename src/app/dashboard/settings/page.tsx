"use client"

import React from 'react'
import { Card, Button, Input } from '@/design-system/components'
import { User, Shield, Bell, AppWindow, Smartphone, Lock } from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground font-medium">Manage your personal information and account security.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="border-rose-500/20 text-rose-500 hover:bg-rose-500/10 bg-transparent cursor-pointer">
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          {[
            { name: 'Profile', icon: User, active: true },
            { name: 'Security', icon: Shield },
            { name: 'Notifications', icon: Bell },
          ].map(item => (
            <button key={item.name} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-transparent cursor-pointer ${item.active ? 'bg-primary/10 text-primary border border-primary/20 font-bold' : 'text-muted-foreground hover:bg-white/5 border border-transparent'}`}>
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6 font-sans">
          <Card className="space-y-6">
            <h3 className="text-lg font-bold border-b border-border pb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" defaultValue={user?.firstName || ''} />
              <Input label="Last Name" defaultValue={user?.lastName || ''} />
              <Input label="Email Address" value={user?.email || ''} disabled className="opacity-70" />
              <Input label="Account Role" value={user?.role || 'Customer'} disabled className="opacity-70" />
            </div>
            <div className="pt-4">
              <Button onClick={() => alert('Profile updates coming soon!')}>Save Changes</Button>
            </div>
          </Card>

          <Card className="space-y-6 border-destructive/20 bg-destructive/5">
            <h3 className="text-lg font-bold border-b border-border pb-4 text-destructive">Security Actions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 rounded-lg"><Smartphone className="w-5 h-5 text-muted-foreground" /></div>
                  <div>
                    <p className="text-sm font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between p-4 glass rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/5 rounded-lg"><Lock className="w-5 h-5 text-muted-foreground" /></div>
                  <div>
                    <p className="text-sm font-bold">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your password regularly to stay secure.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
