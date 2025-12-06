import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('q') || ''
        const category = searchParams.get('category') || 'all'
        const sortBy = searchParams.get('sort') || 'recent'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '12')
        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            isPublic: true,
        }

        // Add search query
        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ]
        }

        // Add category filter
        if (category && category !== 'all') {
            where.category = {
                slug: category,
            }
        }

        // Build orderBy clause
        let orderBy: any = {}
        switch (sortBy) {
            case 'popular':
                orderBy = { copyCount: 'desc' }
                break
            case 'rating':
                orderBy = { ratings: { _count: 'desc' } }
                break
            case 'views':
                orderBy = { viewCount: 'desc' }
                break
            case 'recent':
            default:
                orderBy = { createdAt: 'desc' }
                break
        }

        // Get prompts with pagination
        const [prompts, total] = await Promise.all([
            prisma.prompt.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    category: true,
                    _count: {
                        select: {
                            ratings: true,
                            favorites: true,
                        },
                    },
                },
            }),
            prisma.prompt.count({ where }),
        ])

        // Calculate average rating for each prompt
        const promptsWithRatings = await Promise.all(
            prompts.map(async (prompt) => {
                const ratings = await prisma.rating.findMany({
                    where: { promptId: prompt.id },
                    select: { value: true },
                })

                const avgRating =
                    ratings.length > 0
                        ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
                        : 0

                return {
                    ...prompt,
                    avgRating: Math.round(avgRating * 10) / 10,
                }
            })
        )

        return NextResponse.json({
            prompts: promptsWithRatings,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Failed to search prompts' },
            { status: 500 }
        )
    }
}
