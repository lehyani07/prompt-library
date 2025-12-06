'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import AnalyticsStatCard from '@/components/analytics/AnalyticsStatCard'
import DailyStatsChart from '@/components/analytics/DailyStatsChart'
import CategoryChart from '@/components/analytics/CategoryChart'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

interface AnalyticsData {
    overview: {
        totalUsers: number
        totalPrompts: number
        totalPublicPrompts: number
        totalRatings: number
        totalFavorites: number
        totalCollections: number
        totalViews: number
        totalCopies: number
        avgRating: number
    }
    growth: {
        newUsersWeek: number
        newPromptsWeek: number
        newRatingsWeek: number
    }
    topPrompts: {
        byViews: any[]
        byCopies: any[]
    }
    topCategories: any[]
    mostActiveUsers: any[]
    dailyStats: any[]
    categoryDistribution: any[]
}

export default function AnalyticsDashboard() {
    const { t, language } = useLanguage()
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/admin/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')
            const analyticsData = await res.json()
            setData(analyticsData)
        } catch (err) {
            setError('Failed to load analytics')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <LoadingSkeleton count={4} />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="bg-accent-error/10 border border-accent-error rounded-lg p-4">
                <p className="text-accent-error">{error || 'No data available'}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div>
                <h2 className="text-2xl font-bold text-neutral-text-primary mb-4">
                    {language === 'ar' ? 'نظرة عامة' : 'Overview'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnalyticsStatCard
                        title={language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                        value={data.overview.totalUsers}
                        change={data.growth.newUsersWeek}
                        trend={data.growth.newUsersWeek > 0 ? 'up' : 'neutral'}
                        icon={
                            <svg className="w-6 h-6 text-primary-base" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        }
                    />

                    <AnalyticsStatCard
                        title={language === 'ar' ? 'إجمالي البرومبتات' : 'Total Prompts'}
                        value={data.overview.totalPrompts}
                        change={data.growth.newPromptsWeek}
                        trend={data.growth.newPromptsWeek > 0 ? 'up' : 'neutral'}
                        icon={
                            <svg className="w-6 h-6 text-secondary-base" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        }
                    />

                    <AnalyticsStatCard
                        title={language === 'ar' ? 'إجمالي المشاهدات' : 'Total Views'}
                        value={data.overview.totalViews}
                        icon={
                            <svg className="w-6 h-6 text-accent-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        }
                    />

                    <AnalyticsStatCard
                        title={language === 'ar' ? 'متوسط التقييم' : 'Avg Rating'}
                        value={data.overview.avgRating.toFixed(1)}
                        icon={
                            <svg className="w-6 h-6 text-accent-warning" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DailyStatsChart data={data.dailyStats} />
                <CategoryChart data={data.categoryDistribution} />
            </div>

            {/* Top Prompts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-neutral-bg-card rounded-lg shadow-card p-6">
                    <h3 className="text-lg font-semibold text-neutral-text-primary mb-4">
                        {language === 'ar' ? 'الأكثر مشاهدة' : 'Top by Views'}
                    </h3>
                    <div className="space-y-3">
                        {data.topPrompts.byViews.slice(0, 5).map((prompt, index) => (
                            <div key={prompt.id} className="flex items-center justify-between p-3 bg-neutral-bg-soft rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-primary-base">#{index + 1}</span>
                                    <div>
                                        <p className="font-medium text-neutral-text-primary line-clamp-1">{prompt.title}</p>
                                        <p className="text-sm text-neutral-text-secondary">{prompt.author.name || prompt.author.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-neutral-text-primary">{prompt.viewCount}</p>
                                    <p className="text-xs text-neutral-text-secondary">{language === 'ar' ? 'مشاهدة' : 'views'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-neutral-bg-card rounded-lg shadow-card p-6">
                    <h3 className="text-lg font-semibold text-neutral-text-primary mb-4">
                        {language === 'ar' ? 'الأكثر نسخاً' : 'Top by Copies'}
                    </h3>
                    <div className="space-y-3">
                        {data.topPrompts.byCopies.slice(0, 5).map((prompt, index) => (
                            <div key={prompt.id} className="flex items-center justify-between p-3 bg-neutral-bg-soft rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-secondary-base">#{index + 1}</span>
                                    <div>
                                        <p className="font-medium text-neutral-text-primary line-clamp-1">{prompt.title}</p>
                                        <p className="text-sm text-neutral-text-secondary">{prompt.author.name || prompt.author.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-neutral-text-primary">{prompt.copyCount}</p>
                                    <p className="text-xs text-neutral-text-secondary">{language === 'ar' ? 'نسخة' : 'copies'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
