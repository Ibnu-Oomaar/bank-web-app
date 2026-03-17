import prisma from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/security/encryption'
import { signToken } from '@/security/jwt'
import { RegisterFormValues, LoginFormValues } from '@/utils/validators'

export async function registerUser(data: RegisterFormValues) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      profile: {
        create: {}, // Creates an empty profile linked to the user
      },
      wallets: {
        create: {
          currency: 'USD',
          balance: 0,
        },
      },
    },
    include: {
      profile: true,
      wallets: true,
    },
  })

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return { user, token }
}

export async function loginUser(data: LoginFormValues) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isValidPassword = await verifyPassword(data.password, user.passwordHash)

  if (!isValidPassword) {
    throw new Error('Invalid credentials')
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  return { user, token }
}
