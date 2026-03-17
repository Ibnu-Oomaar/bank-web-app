import { NextRequest, NextResponse } from 'next/server'
import { getAllLoanProducts, createLoanProduct } from '@/modules/loans/services/loan.service'
import { verifyToken } from '@/security/jwt'

async function authenticateStaff(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)
  if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'STAFF')) return null
  return decoded
}

export async function GET(request: NextRequest) {
  try {
    const staff = await authenticateStaff(request)
    if (!staff) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    const products = await getAllLoanProducts()
    return NextResponse.json({ success: true, data: products }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = await authenticateStaff(request)
    if (!staff || staff.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Only admins can create products' }, { status: 403 })
    }

    const body = await request.json()
    const product = await createLoanProduct(body)
    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
