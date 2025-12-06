import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export type ActivityType =
    | 'USER_CREATED'
    | 'USER_UPDATED'
    | 'USER_DELETED'
    | 'PROMPT_CREATED'
    | 'PROMPT_UPDATED'
    | 'PROMPT_DELETED'
    | 'COLLECTION_CREATED'
    | 'COLLECTION_UPDATED'
    | 'COLLECTION_DELETED'
    | 'RATING_CREATED'
    | 'RATING_UPDATED'
    | 'RATING_DELETED'
    | 'LOGIN'
    | 'LOGOUT'
    | 'PASSWORD_RESET'
    | 'EMAIL_VERIFIED'

export interface LogActivityParams {
    userId?: string
    type: ActivityType
    description: string
    metadata?: Record<string, any>
    ipAddress?: string
    userAgent?: string
}

export async function logActivity({
    userId,
    type,
    description,
    metadata,
    ipAddress,
    userAgent,
}: LogActivityParams) {
    try {
        // For now, log to console (can be extended to database)
        const logEntry = {
            timestamp: new Date().toISOString(),
            userId,
            type,
            description,
            metadata,
            ipAddress,
            userAgent,
        }

        console.log('[ACTIVITY LOG]', JSON.stringify(logEntry, null, 2))

        // TODO: Store in database when ActivityLog model is added to schema
        // await prisma.activityLog.create({
        //   data: {
        //     userId,
        //     type,
        //     description,
        //     metadata,
        //     ipAddress,
        //     userAgent,
        //   },
        // })

        return { success: true }
    } catch (error) {
        console.error('Failed to log activity:', error)
        return { success: false, error }
    }
}

// Helper functions for common activities
export const ActivityLogger = {
    userCreated: (userId: string, email: string) =>
        logActivity({
            userId,
            type: 'USER_CREATED',
            description: `User created: ${email}`,
        }),

    userLogin: (userId: string, email: string, ipAddress?: string) =>
        logActivity({
            userId,
            type: 'LOGIN',
            description: `User logged in: ${email}`,
            ipAddress,
        }),

    promptCreated: (userId: string, promptId: string, title: string) =>
        logActivity({
            userId,
            type: 'PROMPT_CREATED',
            description: `Prompt created: ${title}`,
            metadata: { promptId },
        }),

    promptUpdated: (userId: string, promptId: string, title: string) =>
        logActivity({
            userId,
            type: 'PROMPT_UPDATED',
            description: `Prompt updated: ${title}`,
            metadata: { promptId },
        }),

    promptDeleted: (userId: string, promptId: string, title: string) =>
        logActivity({
            userId,
            type: 'PROMPT_DELETED',
            description: `Prompt deleted: ${title}`,
            metadata: { promptId },
        }),

    collectionCreated: (userId: string, collectionId: string, name: string) =>
        logActivity({
            userId,
            type: 'COLLECTION_CREATED',
            description: `Collection created: ${name}`,
            metadata: { collectionId },
        }),

    passwordReset: (userId: string, email: string) =>
        logActivity({
            userId,
            type: 'PASSWORD_RESET',
            description: `Password reset: ${email}`,
        }),

    emailVerified: (userId: string, email: string) =>
        logActivity({
            userId,
            type: 'EMAIL_VERIFIED',
            description: `Email verified: ${email}`,
        }),
}
