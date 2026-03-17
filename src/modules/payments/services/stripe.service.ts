import { stripe } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
const { Decimal } = Prisma

export async function createPaymentIntent(userId: string, amount: number, currency: string = 'usd') {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallets: true },
  })

  if (!user) throw new Error('User not found')
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe expects cents
    currency,
    metadata: { userId, type: 'DEPOSIT' },
  })

  return {
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  }
}

export async function handleStripeWebhook(event: any) {
  const { type, data } = event

  if (type === 'payment_intent.succeeded') {
    const paymentIntent = data.object
    const userId = paymentIntent.metadata.userId
    const amount = paymentIntent.amount / 100

    // Update user wallet balance on successful deposit
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findFirst({
        where: { userId, currency: paymentIntent.currency.toUpperCase() },
      })

      if (wallet) {
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: { increment: new Decimal(amount) } },
        })

        const transaction = await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEPOSIT',
            amount: new Decimal(amount),
            currency: paymentIntent.currency.toUpperCase(),
            status: 'COMPLETED',
            reference: paymentIntent.id,
            description: 'Stripe Deposit',
          },
        })

        await tx.stripeCharge.create({
          data: {
            transactionId: transaction.id,
            stripeChargeId: paymentIntent.id,
            amount: new Decimal(amount),
            currency: paymentIntent.currency.toUpperCase(),
            status: 'succeeded',
          },
        })
      }
    })
  }

  return { success: true }
}
