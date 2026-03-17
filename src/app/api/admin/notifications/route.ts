import { NextRequest, NextResponse } from 'next/server'
import { getAllNotifications, broadcastNotification, createNotification } from '@/modules/notifications/services/notification.service'
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

    const notifications = await getAllNotifications()
    return NextResponse.json({ success: true, data: notifications }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const staff = await authenticateStaff(request)
    if (!staff) return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { userId, type, title, message, broadcast } = body

    if (broadcast) {
      const result = await broadcastNotification(type || 'SYSTEM', title, message)
      return NextResponse.json({ success: true, data: result }, { status: 201 })
    }

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId is required for non-broadcast' }, { status: 400 })
    }

    const notification = await createNotification(userId, type || 'SYSTEM', title, message)
    return NextResponse.json({ success: true, data: notification }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
