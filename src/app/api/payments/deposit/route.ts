import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/modules/payments/services/stripe.service'
import { verifyToken } from '@/security/jwt'

function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  return verifyToken(token)
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticate(request)
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { amount, currency } = body
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 })
    }

    const result = await createPaymentIntent(user.userId, amount, currency || 'usd')
    
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
