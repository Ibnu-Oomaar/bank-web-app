import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/modules/auth/services/auth.service'
import { loginSchema } from '@/utils/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)
    const result = await loginUser(validatedData)
    
    return NextResponse.json({ success: true, data: result }, { status: 200 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 401 })
  }
}
