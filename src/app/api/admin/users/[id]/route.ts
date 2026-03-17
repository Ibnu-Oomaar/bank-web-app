import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUserRole, updateUserKYCStatus, deleteUser } from '@/modules/users/services/user.service'
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
    const admin = await authenticateAdmin(request)
    if (!admin) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    const user = await getUserById(params.id)
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: user }, { status: 200 })
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
    const { role, kycStatus } = body

    let updatedUser
    if (role) {
      updatedUser = await updateUserRole(params.id, role)
    }
    if (kycStatus) {
      updatedUser = await updateUserKYCStatus(params.id, kycStatus)
    }

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 })
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

    await deleteUser(params.id)
    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
