"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  HandCoins, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Wallets', icon: Wallet, href: '/dashboard/wallets' },
  { name: 'Transactions', icon: ArrowLeftRight, href: '/dashboard/transactions' },
  { name: 'Loans', icon: HandCoins, href: '/dashboard/loans' },
  { name: 'Payments', icon: CreditCard, href: '/dashboard/payments' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore(state => state.logout)

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <aside className="w-64 glass border-y-0 border-l-0 border-r border-border h-screen flex flex-col sticky top-0">
      <div className="p-8">
        <h2 className="text-2xl font-black gradient-text tracking-tighter">OOMAAR</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors font-medium border-0 bg-transparent cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export const Navbar = () => {
  const user = useAuthStore(state => state.user)
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : '??'
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User'

  return (
    <header className="h-20 border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/50 backdrop-blur-md z-10">
      <div>
        <h3 className="text-lg font-semibold">Overview</h3>
        <p className="text-xs text-muted-foreground font-medium">Welcome back, {fullName}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/5 relative border-0 bg-transparent cursor-pointer">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-cyan-400 flex items-center justify-center font-bold text-white uppercase">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
