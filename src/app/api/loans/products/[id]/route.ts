import { NextRequest, NextResponse } from 'next/server'
import { getLoanProductById, updateLoanProduct, deleteLoanProduct } from '@/modules/loans/services/loan.service'
import { verifyToken } from '@/security/jwt'

async function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'ADMIN') return null
  return decoded
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getLoanProductById(params.id)
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: product }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const product = await updateLoanProduct(params.id, body)
    return NextResponse.json({ success: true, data: product }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await authenticateAdmin(request)
    if (!admin) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    await deleteLoanProduct(params.id)
    return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
