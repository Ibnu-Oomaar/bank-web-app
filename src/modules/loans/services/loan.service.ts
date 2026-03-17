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

export async function getAllLoanProducts(onlyActive = false) {
  return await prisma.loanProduct.findMany({
    where: onlyActive ? { isActive: true } : {},
    orderBy: { createdAt: 'desc' },
  })
}

export async function getLoanProductById(id: string) {
  return await prisma.loanProduct.findUnique({
    where: { id },
  })
}

export async function updateLoanProduct(id: string, data: Partial<{
  name: string
  description: string
  interestRate: number
  maxTermMonths: number
  minAmount: number
  maxAmount: number
  isActive: boolean
}>) {
  const updateData: any = { ...data }
  if (data.interestRate !== undefined) updateData.interestRate = new Decimal(data.interestRate)
  if (data.minAmount !== undefined) updateData.minAmount = new Decimal(data.minAmount)
  if (data.maxAmount !== undefined) updateData.maxAmount = new Decimal(data.maxAmount)

  return await prisma.loanProduct.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteLoanProduct(id: string) {
  return await prisma.loanProduct.delete({
    where: { id },
  })
}

export async function getAllLoanApplications() {
  return await prisma.loanApplication.findMany({
    include: {
      user: true,
      product: true,
    },
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
        approvedAt: new Date(),
      },
      include: { user: true },
    })

    await tx.loanRepayment.create({
      data: {
        loanApplicationId: applicationId,
        amount: new Decimal(approvedAmount),
        principalAmount: new Decimal(approvedAmount),
        interestAmount: new Decimal(0),
        status: 'PENDING',
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    return application
  })
}

export async function rejectLoan(applicationId: string) {
  return await prisma.loanApplication.update({
    where: { id: applicationId },
    data: { status: 'REJECTED' },
  })
}

