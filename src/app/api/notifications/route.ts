import { NextRequest, NextResponse } from 'next/server'
import { getUserNotifications, markAsRead } from '@/modules/notifications/services/notification.service'
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
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const notifications = await getUserNotifications(user.userId)
    return NextResponse.json({ success: true, data: notifications }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = authenticate(request)
    if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id } = body
    
    if (!id) return NextResponse.json({ success: false, message: 'Notification ID required' }, { status: 400 })

    const result = await markAsRead(id)
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
