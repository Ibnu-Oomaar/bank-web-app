import prisma from '@/lib/prisma'

export async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      profile: true,
      wallets: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      wallets: {
        include: {
          transactions: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      loans: true,
      notifications: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export async function updateUserRole(userId: string, role: 'CUSTOMER' | 'STAFF' | 'ADMIN') {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  })
}

export async function updateUserKYCStatus(userId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
  return await prisma.profile.update({
    where: { userId },
    data: { kycStatus: status },
  })
}

export async function deleteUser(userId: string) {
  // In a real banking app, we'd probably just deactivate or anonymize
  // But for "Full CRUD", we'll implement delete.
  return await prisma.user.delete({
    where: { id: userId },
  })
}
