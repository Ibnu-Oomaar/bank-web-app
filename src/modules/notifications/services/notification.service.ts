import prisma from '@/lib/prisma'

export async function createNotification(userId: string, type: 'TRANSACTION' | 'SECURITY' | 'LOAN_UPDATE' | 'SYSTEM', title: string, message: string) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  })
}

export async function getUserNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export async function markAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  })
}

export async function broadcastNotification(type: 'SYSTEM' | 'SECURITY', title: string, message: string) {
  const users = await prisma.user.findMany({ select: { id: true } })
  
  const notifications = users.map(user => ({
    userId: user.id,
    type,
    title,
    message,
  }))

  return await prisma.notification.createMany({
    data: notifications,
  })
}

export async function getAllNotifications() {
  return await prisma.notification.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export async function deleteNotification(id: string) {
  return await prisma.notification.delete({
    where: { id },
  })
}

export async function getAdminStats() {
  const userCount = await prisma.user.count()
  const totalBalance = await prisma.wallet.aggregate({
    _sum: { balance: true },
  })
  const loanCount = await prisma.loanApplication.count({
    where: { status: 'PENDING' },
  })
  
  return {
    userCount,
    totalBalance: totalBalance._sum.balance || 0,
    pendingLoans: loanCount,
  }
}

