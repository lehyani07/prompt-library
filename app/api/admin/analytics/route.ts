import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { subDays, format } from 'date-fns'

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get date range (last 30 days)
        const thirtyDaysAgo = subDays(new Date(), 30)
        const sevenDaysAgo = subDays(new Date(), 7)

        // Total counts
        const [
            totalUsers,
            totalPrompts,
            totalPublicPrompts,
            totalRatings,
            totalFavorites,
            totalCollections,
            totalViews,
            totalCopies,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.prompt.count(),
            prisma.prompt.count({ where: { isPublic: true } }),
            prisma.rating.count(),
            prisma.favorite.count(),
            prisma.collection.count(),
            prisma.prompt.aggregate({ _sum: { viewCount: true } }),
            prisma.prompt.aggregate({ _sum: { copyCount: true } }),
        ])

        // Recent growth (last 7 days)
        const [
            newUsersWeek,
            newPromptsWeek,
            newRatingsWeek,
        ] = await Promise.all([
            prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.prompt.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.rating.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        ])

        // Top prompts by views
        const topPromptsByViews = await prisma.prompt.findMany({
            where: { isPublic: true },
            orderBy: { viewCount: 'desc' },
            take: 10,
            include: {
                author: { select: { name: true, email: true } },
                category: true,
                _count: { select: { ratings: true, favorites: true } },
            },
        })

        // Top prompts by copies
        const topPromptsByCopies = await prisma.prompt.findMany({
            where: { isPublic: true },
            orderBy: { copyCount: 'desc' },
            take: 10,
            include: {
                author: { select: { name: true, email: true } },
                category: true,
            },
        })

        // Top categories
        const topCategories = await prisma.category.findMany({
            include: {
                _count: { select: { prompts: true } },
            },
            orderBy: {
                prompts: { _count: 'desc' },
            },
            take: 10,
        })

        // Most active users
        const mostActiveUsers = await prisma.user.findMany({
            where: { role: 'USER' },
            include: {
                _count: {
                    select: {
                        prompts: true,
                        ratings: true,
                        favorites: true,
                        collections: true,
                    },
                },
            },
            orderBy: {
                prompts: { _count: 'desc' },
            },
            take: 10,
        })

        // Daily stats for last 30 days
        const dailyStats = []
        for (let i = 29; i >= 0; i--) {
            const date = subDays(new Date(), i)
            const nextDate = subDays(new Date(), i - 1)

            const [users, prompts, ratings] = await Promise.all([
                prisma.user.count({
                    where: {
                        createdAt: {
                            gte: date,
                            lt: nextDate,
                        },
                    },
                }),
                prisma.prompt.count({
                    where: {
                        createdAt: {
                            gte: date,
                            lt: nextDate,
                        },
                    },
                }),
                prisma.rating.count({
                    where: {
                        createdAt: {
                            gte: date,
                            lt: nextDate,
                        },
                    },
                }),
            ])

            dailyStats.push({
                date: format(date, 'MMM dd'),
                users,
                prompts,
                ratings,
            })
        }

        // Average rating
        const allRatings = await prisma.rating.findMany({
            select: { value: true },
        })
        const avgRating = allRatings.length > 0
            ? allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length
            : 0

        // Category distribution
        const categoryDistribution = await prisma.category.findMany({
            include: {
                _count: { select: { prompts: true } },
            },
        })

        return NextResponse.json({
            overview: {
                totalUsers,
                totalPrompts,
                totalPublicPrompts,
                totalRatings,
                totalFavorites,
                totalCollections,
                totalViews: totalViews._sum.viewCount || 0,
                totalCopies: totalCopies._sum.copyCount || 0,
                avgRating: Math.round(avgRating * 10) / 10,
            },
            growth: {
                newUsersWeek,
                newPromptsWeek,
                newRatingsWeek,
            },
            topPrompts: {
                byViews: topPromptsByViews,
                byCopies: topPromptsByCopies,
            },
            topCategories,
            mostActiveUsers,
            dailyStats,
            categoryDistribution,
        })
    } catch (error) {
        console.error('Analytics error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
