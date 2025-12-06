import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const checks = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        checks: {} as Record<string, any>,
    }

    try {
        // Database check
        const dbStart = Date.now()
        await prisma.$queryRaw`SELECT 1`
        const dbTime = Date.now() - dbStart

        checks.checks.database = {
            status: 'healthy',
            responseTime: `${dbTime}ms`,
        }

        // Check database counts
        const [userCount, promptCount] = await Promise.all([
            prisma.user.count(),
            prisma.prompt.count(),
        ])

        checks.checks.data = {
            users: userCount,
            prompts: promptCount,
        }

        // Memory check
        if (typeof process !== 'undefined' && process.memoryUsage) {
            const memory = process.memoryUsage()
            checks.checks.memory = {
                heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
                rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
            }
        }

        // Environment check
        checks.checks.environment = {
            nodeVersion: process.version,
            platform: process.platform,
            uptime: `${Math.round(process.uptime())}s`,
        }

        return NextResponse.json(checks, { status: 200 })
    } catch (error) {
        checks.status = 'unhealthy'
        checks.checks.error = {
            message: error instanceof Error ? error.message : 'Unknown error',
        }

        return NextResponse.json(checks, { status: 503 })
    }
}
