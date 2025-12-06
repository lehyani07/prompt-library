import { z } from "zod"

// Admin user update schema
export const adminUpdateUserSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .optional(),
    email: z.string()
        .email("Invalid email address")
        .max(255, "Email must be less than 255 characters")
        .optional(),
    role: z.enum(["USER", "MODERATOR", "ADMIN"]).optional(),
    status: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]).optional(),
})

// Admin prompt update schema
export const adminUpdatePromptSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be less than 200 characters")
        .optional(),
    content: z.string()
        .min(10, "Content must be at least 10 characters")
        .max(5000, "Content must be less than 5000 characters")
        .optional(),
    description: z.string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    isPublic: z.boolean().optional(),
    categoryId: z.string().optional().nullable(),
})

// Rating comment validation
export const ratingCommentSchema = z.object({
    value: z.number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
    comment: z.string()
        .max(1000, "Comment must be less than 1000 characters")
        .trim()
        .optional(),
})

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>
export type AdminUpdatePromptInput = z.infer<typeof adminUpdatePromptSchema>
export type RatingCommentInput = z.infer<typeof ratingCommentSchema>
