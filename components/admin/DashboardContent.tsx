'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"
import StatsCard from "@/components/admin/StatsCard"

interface DashboardContentProps {
    totalUsers: number
    totalPrompts: number
    publicPrompts: number
    totalRatings: number
    totalFavorites: number
    recentUsers: number
    recentPrompts: number
}

export default function DashboardContent({
    totalUsers,
    totalPrompts,
    publicPrompts,
    totalRatings,
    totalFavorites,
    recentUsers,
    recentPrompts,
}: DashboardContentProps) {
    const { t } = useLanguage()

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">{t.admin.dashboard.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title={t.admin.dashboard.totalUsers}
                    value={totalUsers}
                    change={`+${recentUsers} ${t.admin.dashboard.thisWeek}`}
                    icon="users"
                />
                <StatsCard
                    title={t.admin.dashboard.totalPrompts}
                    value={totalPrompts}
                    change={`+${recentPrompts} ${t.admin.dashboard.thisWeek}`}
                    icon="document"
                />
                <StatsCard title={t.admin.dashboard.publicPrompts} value={publicPrompts} icon="globe" />
                <StatsCard title={t.admin.dashboard.totalRatings} value={totalRatings} icon="star" />
                <StatsCard title={t.admin.dashboard.totalFavorites} value={totalFavorites} icon="star" />
            </div>
        </div>
    )
}






