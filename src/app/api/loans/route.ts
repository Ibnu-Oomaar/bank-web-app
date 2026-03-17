import { NextRequest, NextResponse } from 'next/server'
import { applyForLoan, getUserLoans } from '@/modules/loans/services/loan.service'
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
    const result = await applyForLoan(user.userId, body)
    
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = authenticate(request)
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const loans = await getUserLoans(user.userId)
    return NextResponse.json({ success: true, data: loans }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
