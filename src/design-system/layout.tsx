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
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard', roles: ['CUSTOMER', 'STAFF', 'ADMIN'] },
  { name: 'Wallets', icon: Wallet, href: '/dashboard/wallets', roles: ['CUSTOMER'] },
  { name: 'Transactions', icon: ArrowLeftRight, href: '/dashboard/transactions', roles: ['CUSTOMER'] },
  { name: 'Loans', icon: HandCoins, href: '/dashboard/loans', roles: ['CUSTOMER'] },
  { name: 'Payments', icon: CreditCard, href: '/dashboard/payments', roles: ['CUSTOMER'] },
  // Admin/Staff specific
  { name: 'Users', icon: Settings, href: '/dashboard/admin/users', roles: ['ADMIN', 'STAFF'] },
  { name: 'Loan Requests', icon: HandCoins, href: '/dashboard/admin/loans', roles: ['ADMIN', 'STAFF'] },
  { name: 'System Ledger', icon: Wallet, href: '/dashboard/admin/ledgers', roles: ['ADMIN'] },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings', roles: ['CUSTOMER', 'STAFF', 'ADMIN'] },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  )

  return (
    <aside className="w-64 border-r border-border bg-card h-screen flex flex-col sticky top-0 hidden md:flex">
      <div className="p-6">
        <h2 className="text-xl font-bold tracking-tight px-4">OOMAAR BANK</h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 group text-sm font-medium ${
                isActive 
                ? 'bg-secondary text-secondary-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? '' : 'group-hover:scale-105 transition-transform'}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors font-medium border-0 bg-transparent cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
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
  const role = user?.role || 'CUSTOMER'

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10 w-full">
      <div className="flex items-center gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{fullName}</h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{role}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-accent relative border-0 bg-transparent cursor-pointer transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-secondary-foreground text-xs uppercase shadow-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}

