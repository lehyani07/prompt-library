import { prisma } from "@/lib/prisma"
import AnalyticsPageContent from "@/components/admin/AnalyticsPageContent"

export default async function AnalyticsPage() {
    const [
        totalViews,
        totalCopies,
        avgRating,
        topPrompts,
        topCategories
    ] = await Promise.all([
        prisma.prompt.aggregate({ _sum: { viewCount: true } }),
        prisma.prompt.aggregate({ _sum: { copyCount: true } }),
        prisma.rating.aggregate({ _avg: { value: true } }),
        prisma.prompt.findMany({
            take: 5,
            orderBy: { viewCount: 'desc' },
            include: {
                author: { select: { name: true, email: true } },
                category: true
            }
        }),
        prisma.category.findMany({
            take: 5,
            include: {
                _count: { select: { prompts: true } }
            },
            orderBy: {
                prompts: { _count: 'desc' }
            }
        })
    ])

    return (
        <AnalyticsPageContent
            totalViews={totalViews._sum.viewCount || 0}
            totalCopies={totalCopies._sum.copyCount || 0}
            avgRating={Math.round((avgRating._avg.value || 0) * 10) / 10}
            topPrompts={topPrompts}
            topCategories={topCategories}
        />
    )
}
