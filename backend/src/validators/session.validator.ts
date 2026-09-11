import { z } from 'zod'

export const sessionIdParamSchema = z.object({
  sessionId: z.string().min(1, 'sessionId is required'),
})

export const sendMessageSchema = z.object({
  questionId: z.string().min(1, 'questionId is required'),
  message: z
    .string()
    .min(1, 'message cannot be empty')
    .max(5000, 'message is too long'),
})

export type SendMessageInput = z.infer<typeof sendMessageSchema>
