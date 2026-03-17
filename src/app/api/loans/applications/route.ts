import { NextRequest, NextResponse } from 'next/server'
import { getAllLoanApplications, approveLoan, rejectLoan } from '@/modules/loans/services/loan.service'
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

    const applications = await getAllLoanApplications()
    return NextResponse.json({ success: true, data: applications }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const staff = await authenticateStaff(request)
    if (!staff) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { id, action, approvedAmount } = body

    if (action === 'APPROVE') {
      const application = await approveLoan(id, approvedAmount)
      return NextResponse.json({ success: true, data: application }, { status: 200 })
    } else if (action === 'REJECT') {
      const application = await rejectLoan(id)
      return NextResponse.json({ success: true, data: application }, { status: 200 })
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
