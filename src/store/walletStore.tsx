import { create } from 'zustand'

export interface Wallet {
  id: string
  userId: string
  currency: string
  balance: number
  isActive: boolean
}

interface WalletState {
  activeWallet: Wallet | null
  setActiveWallet: (wallet: Wallet) => void
  clearWallet: () => void
}

export const useWalletStore = create<WalletState>()((set) => ({
  activeWallet: null,
  setActiveWallet: (wallet) => set({ activeWallet: wallet }),
  clearWallet: () => set({ activeWallet: null }),
}))
