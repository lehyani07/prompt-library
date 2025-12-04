import { prisma } from "@/lib/prisma"
import StatsCard from "@/components/admin/StatsCard"

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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Views"
                    value={totalViews._sum.viewCount || 0}
                    icon="globe"
                />
                <StatsCard
                    title="Total Copies"
                    value={totalCopies._sum.copyCount || 0}
                    icon="document"
                />
                <StatsCard
                    title="Average Rating"
                    value={Math.round((avgRating._avg.value || 0) * 10) / 10}
                    icon="star"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Prompts */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Top Prompts by Views</h2>
                    <div className="space-y-3">
                        {topPrompts.map((prompt, index) => (
                            <div key={prompt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                                        <span className="font-medium text-gray-900">{prompt.title}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {prompt.author.name} • {prompt.category?.name || 'Uncategorized'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">{prompt.viewCount} views</div>
                                    <div className="text-sm text-gray-500">{prompt.copyCount} copies</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Top Categories</h2>
                    <div className="space-y-3">
                        {topCategories.map((category, index) => (
                            <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                                    <span className="font-medium text-gray-900">{category.name}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {category._count.prompts} prompts
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
