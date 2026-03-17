import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/modules/users/services/user.service'
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
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const users = await getAllUsers()
    return NextResponse.json({ success: true, data: users }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
