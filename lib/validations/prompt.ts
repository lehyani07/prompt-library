import { z } from "zod"

export const createPromptSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be less than 200 characters"),
    content: z.string()
        .min(10, "Content must be at least 10 characters")
        .max(5000, "Content must be less than 5000 characters"),
    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    isPublic: z.boolean().optional(),
    categoryId: z.string().optional().nullable(),
})

export const updatePromptSchema = createPromptSchema.partial()

export type CreatePromptInput = z.infer<typeof createPromptSchema>
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>
