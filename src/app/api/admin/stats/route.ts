import { NextRequest, NextResponse } from 'next/server'
import { getAdminStats } from '@/modules/notifications/services/notification.service'
import { verifyToken } from '@/security/jwt'

function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    const user = authenticate(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
    }

    const stats = await getAdminStats()
    return NextResponse.json({ success: true, data: stats }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
