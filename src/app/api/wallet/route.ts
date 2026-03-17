import { NextRequest, NextResponse } from 'next/server'
import { processTransfer, getWalletBalance, getTransactionHistory } from '@/modules/wallet/services/wallet.service'
import { walletTransferSchema } from '@/utils/validators'
import { verifyToken } from '@/security/jwt'

// Helper to authenticate request
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
    const validatedData = walletTransferSchema.parse(body)
    const result = await processTransfer(user.userId, validatedData)
    
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = authenticate(request)
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const balance = await getWalletBalance(user.userId)
    const history = await getTransactionHistory(user.userId)
    
    return NextResponse.json({ success: true, data: { balance, history } }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
