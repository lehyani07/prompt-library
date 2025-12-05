'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"
import StatsCard from "@/components/admin/StatsCard"

interface Prompt {
    id: string
    title: string
    viewCount: number
    copyCount: number
    author: {
        name: string | null
        email: string
    }
    category: {
        name: string
    } | null
}

interface Category {
    id: string
    name: string
    _count: {
        prompts: number
    }
}

interface AnalyticsPageContentProps {
    totalViews: number
    totalCopies: number
    avgRating: number
    topPrompts: Prompt[]
    topCategories: Category[]
}

export default function AnalyticsPageContent({
    totalViews,
    totalCopies,
    avgRating,
    topPrompts,
    topCategories,
}: AnalyticsPageContentProps) {
    const { t } = useLanguage()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{t.admin.analytics.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title={t.admin.analytics.totalViews}
                    value={totalViews}
                    icon="globe"
                />
                <StatsCard
                    title={t.admin.analytics.totalCopies}
                    value={totalCopies}
                    icon="document"
                />
                <StatsCard
                    title={t.admin.analytics.averageRating}
                    value={avgRating}
                    icon="star"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Prompts */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{t.admin.analytics.topPromptsByViews}</h2>
                    <div className="space-y-3">
                        {topPrompts.map((prompt, index) => (
                            <div key={prompt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                                        <span className="font-medium text-gray-900">{prompt.title}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {prompt.author.name} • {prompt.category?.name || t.admin.prompts.uncategorized}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">{prompt.viewCount} {t.admin.analytics.views}</div>
                                    <div className="text-sm text-gray-500">{prompt.copyCount} {t.admin.analytics.copies}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{t.admin.analytics.topCategories}</h2>
                    <div className="space-y-3">
                        {topCategories.map((category, index) => (
                            <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                                    <span className="font-medium text-gray-900">{category.name}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {category._count.prompts} {t.admin.analytics.prompts}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}



