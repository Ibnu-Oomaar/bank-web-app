import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { handleStripeWebhook } from '@/modules/payments/services/stripe.service'

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Webhook secret or signature missing')
    }
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    await handleStripeWebhook(event)
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err: any) {
    console.error('Webhook handler failed.', err.message)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
