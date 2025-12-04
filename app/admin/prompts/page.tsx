import { prisma } from "@/lib/prisma"
import PromptsPageContent from "@/components/admin/PromptsPageContent"

const ITEMS_PER_PAGE = 10

export default async function PromptsPage({
    searchParams
}: {
    searchParams: Promise<{ category?: string; status?: string; search?: string; page?: string }>
}) {
    const params = await searchParams
    let currentPage = parseInt(params.page || '1', 10)
    
    // Validate page number
    if (isNaN(currentPage) || currentPage < 1) {
        currentPage = 1
    }
    
    const skip = (currentPage - 1) * ITEMS_PER_PAGE

    const where = {
        ...(params.category && { categoryId: params.category }),
        ...(params.search && {
            OR: [
                { title: { contains: params.search } },
                { content: { contains: params.search } }
            ]
        })
    }

    const [prompts, totalCount] = await Promise.all([
        prisma.prompt.findMany({
            where,
            include: {
                author: {
                    select: { name: true, email: true }
                },
                category: true,
                _count: {
                    select: {
                        favorites: true,
                        ratings: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: ITEMS_PER_PAGE,
            skip
        }),
        prisma.prompt.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
    
    // Ensure currentPage doesn't exceed totalPages
    const validCurrentPage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1

    return <PromptsPageContent prompts={prompts} currentPage={validCurrentPage} totalPages={totalPages || 1} totalCount={totalCount} itemsPerPage={ITEMS_PER_PAGE} />
}
