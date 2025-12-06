'use client'

interface StatCardProps {
    title: string
    value: number | string
    change?: number
    icon: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
}

export default function AnalyticsStatCard({ title, value, change, icon, trend = 'neutral' }: StatCardProps) {
    const trendColors = {
        up: 'text-accent-success',
        down: 'text-accent-error',
        neutral: 'text-neutral-text-secondary',
    }

    const trendIcons = {
        up: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        ),
        down: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        ),
        neutral: null,
    }

    return (
        <div className="bg-neutral-bg-card rounded-lg shadow-card p-6 hover:shadow-floating transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary-base/10 rounded-lg">
                    {icon}
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
                        {trendIcons[trend]}
                        <span className="text-sm font-medium">{change > 0 ? '+' : ''}{change}%</span>
                    </div>
                )}
            </div>

            <h3 className="text-sm font-medium text-neutral-text-secondary mb-1">
                {title}
            </h3>

            <p className="text-3xl font-bold text-neutral-text-primary">
                {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
        </div>
    )
}
