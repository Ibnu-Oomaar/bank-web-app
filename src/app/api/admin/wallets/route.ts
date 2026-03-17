import { NextRequest, NextResponse } from 'next/server'
import { getAllWallets, adjustWalletBalance, getPlatformLedger } from '@/modules/wallet/services/wallet.service'
import { verifyToken } from '@/security/jwt'

async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'ADMIN') return null
  return decoded
}

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    const type = request.nextUrl.searchParams.get('type')
    
    if (type === 'ledger') {
      const ledger = await getPlatformLedger()
      return NextResponse.json({ success: true, data: ledger }, { status: 200 })
    }

    const wallets = await getAllWallets()
    return NextResponse.json({ success: true, data: wallets }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { walletId, amount, type, description } = body

    if (!walletId || !amount || !type || !description) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const updatedWallet = await adjustWalletBalance(walletId, Number(amount), type, description)
    return NextResponse.json({ success: true, data: updatedWallet }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
