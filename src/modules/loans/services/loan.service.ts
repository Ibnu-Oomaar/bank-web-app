import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
const { Decimal } = Prisma

export async function createLoanProduct(data: {
  name: string
  description?: string
  interestRate: number
  maxTermMonths: number
  minAmount: number
  maxAmount: number
}) {
  return await prisma.loanProduct.create({
    data: {
      ...data,
      interestRate: new Decimal(data.interestRate),
      minAmount: new Decimal(data.minAmount),
      maxAmount: new Decimal(data.maxAmount),
    },
  })
}

export async function applyForLoan(userId: string, data: {
  productId: string
  requestedAmount: number
  termMonths: number
}) {
  const product = await prisma.loanProduct.findUnique({
    where: { id: data.productId, isActive: true },
  })

  if (!product) throw new Error('Loan product not found or inactive')
  
  if (data.requestedAmount < Number(product.minAmount) || data.requestedAmount > Number(product.maxAmount)) {
    throw new Error(`Amount must be between ${product.minAmount} and ${product.maxAmount}`)
  }

  return await prisma.loanApplication.create({
    data: {
      userId,
      productId: data.productId,
      requestedAmount: new Decimal(data.requestedAmount),
      termMonths: data.termMonths,
      status: 'PENDING',
    },
  })
}

export async function getUserLoans(userId: string) {
  return await prisma.loanApplication.findMany({
    where: { userId },
    include: { product: true, repayments: true },
    orderBy: { appliedAt: 'desc' },
  })
}

export async function approveLoan(applicationId: string, approvedAmount: number) {
  return await prisma.$transaction(async (tx) => {
    const application = await tx.loanApplication.update({
      where: { id: applicationId },
      data: {
        status: 'APPROVED',
        approvedAmount: new Decimal(approvedAmount),
        approvedAt: new Error().stack ? new Date() : new Date(), // Just ensuring valid date
      },
      include: { user: true },
    })

    // Create initial repayment schedule (simplified: 1 month from now)
    // In a real app, this would be a loop for each month of the term
    await tx.loanRepayment.create({
      data: {
        loanApplicationId: applicationId,
        amount: new Decimal(approvedAmount), // placeholder
        principalAmount: new Decimal(approvedAmount),
        interestAmount: new Decimal(0),
        status: 'PENDING',
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    return application
  })
}
