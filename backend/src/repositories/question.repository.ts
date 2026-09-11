import prisma from '../lib/prisma.js'

export const findQuestionById = async (questionId: string) => {
  return prisma.question.findUnique({
    where: {
      id: questionId,
    },
  })
}

export const findQuestionsByIds = async (questionIds: string[]) => {
  return prisma.question.findMany({
    where: {
      id: {
        in: questionIds,
      },
    },
  })
}
