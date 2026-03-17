import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/modules/auth/services/auth.service'
import { registerSchema } from '@/utils/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    const result = await registerUser(validatedData)
    
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 400 })
  }
}
