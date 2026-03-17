import prisma from '@/lib/prisma'
import { WalletTransferFormValues } from '@/utils/validators'

export async function processTransfer(senderId: string, data: WalletTransferFormValues) {
  // 1. Get sender and recipient wallets
  const senderWallet = await prisma.wallet.findFirst({
    where: { userId: senderId, isActive: true },
  })
  
  const recipientUser = await prisma.user.findUnique({
    where: { email: data.recipientEmail },
  })

  if (!senderWallet || !recipientUser) {
    throw new Error('Invalid sender or recipient')
  }

  const recipientWallet = await prisma.wallet.findFirst({
    where: { userId: recipientUser.id, isActive: true },
  })

  if (!recipientWallet) {
    throw new Error('Recipient has no active wallet')
  }

  if (Number(senderWallet.balance) < data.amount) {
    throw new Error('Insufficient funds')
  }

  // 2. Perform Double-Entry Ledger Transaction using Prisma Interactive Transaction
  return await prisma.$transaction(async (tx) => {
    // Deduct from sender
    const updatedSenderWallet = await tx.wallet.update({
      where: { id: senderWallet.id },
      data: { balance: { decrement: data.amount } },
    })

    // Add to recipient
    const updatedRecipientWallet = await tx.wallet.update({
      where: { id: recipientWallet.id },
      data: { balance: { increment: data.amount } },
    })

    // Create Transaction Record
    const transaction = await tx.transaction.create({
      data: {
        walletId: senderWallet.id,
        type: 'TRANSFER_OUT',
        amount: data.amount,
        currency: senderWallet.currency,
        status: 'COMPLETED',
        reference: `TRF-${Date.now()}-${senderId}`,
        description: data.description || 'Wallet Transfer',
      },
    })

    // Create Double-Entry Ledger Entries
    await tx.ledgerEntry.createMany({
      data: [
        {
          transactionId: transaction.id,
          walletId: senderWallet.id,
          accountId: 'USER_WALLET',
          entryType: 'DEBIT',
          amount: data.amount,
          currency: senderWallet.currency,
          description: `Transfer Out to ${data.recipientEmail}`,
        },
        {
          transactionId: transaction.id,
          walletId: recipientWallet.id,
          accountId: 'USER_WALLET',
          entryType: 'CREDIT',
          amount: data.amount,
          currency: recipientWallet.currency,
          description: `Transfer In from sender ${senderId}`,
        },
      ],
    })

    return { transaction, senderBalance: updatedSenderWallet.balance }
  })
}

export async function getFullWalletData(userId: string) {
  const wallet = await prisma.wallet.findFirst({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      }
    }
  })
  return wallet
}

export async function getAllWallets() {
  return await prisma.wallet.findMany({
    include: {
      user: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function adjustWalletBalance(walletId: string, amount: number, type: 'CREDIT' | 'DEBIT', description: string) {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUnique({ where: { id: walletId } })
    if (!wallet) throw new Error('Wallet not found')

    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: type === 'CREDIT' ? { increment: amount } : { decrement: amount },
      }
    })

    const transaction = await tx.transaction.create({
      data: {
        walletId,
        type: type === 'CREDIT' ? 'DEPOSIT' : 'WITHDRAWAL',
        amount: amount,
        currency: wallet.currency,
        status: 'COMPLETED',
        reference: `ADJ-${Date.now()}-${walletId}`,
        description: `ADMIN ADJUSTMENT: ${description}`,
      }
    })

    await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId,
        accountId: 'USER_WALLET',
        entryType: type,
        amount,
        currency: wallet.currency,
        description: `Admin manual adjustment: ${description}`,
      }
    })

    return updatedWallet
  })
}

export async function getPlatformLedger() {
  return await prisma.ledgerEntry.findMany({
    include: {
      transaction: true,
      wallet: { include: { user: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

