'use client'

import { useAnalytics } from '@/lib/analytics'

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    useAnalytics()
    return <>{children}</>
}
