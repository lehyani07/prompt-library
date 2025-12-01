import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import ExploreContent from "@/components/ExploreContent"

export default async function Explore({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>
}) {
    const session = await auth()
    const params = await searchParams
    const query = params.q || ""
    const categorySlug = params.category || ""

    // Build where clause
    const where: any = {
        isPublic: true,
    }

    if (query) {
        where.OR = [
            { title: { contains: query } }, // SQLite is case-insensitive by default for LIKE/contains usually, but Prisma handles it.
            { description: { contains: query } },
        ]
    }

    if (categorySlug) {
        where.category = {
            slug: categorySlug
        }
    }

    // Fetch categories for filter
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })

    // Fetch public prompts with filters
    const prompts = await prisma.prompt.findMany({
        where,
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    image: true
                }
            },
            category: true,
            _count: {
                select: {
                    favorites: true,
                    ratings: true
                }
            },
            ratings: {
                select: {
                    value: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 50 // Increased limit for explore
    })

    return <ExploreContent prompts={prompts} categories={categories} session={session} />
}
