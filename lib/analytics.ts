'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
    interface Window {
        gtag?: (
            command: string,
            targetId: string,
            config?: Record<string, any>
        ) => void
    }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Track page views
export function useAnalytics() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!GA_MEASUREMENT_ID) return

        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

        window.gtag?.('config', GA_MEASUREMENT_ID, {
            page_path: url,
        })
    }, [pathname, searchParams])
}

// Track custom events
export function trackEvent({
    action,
    category,
    label,
    value,
}: {
    action: string
    category: string
    label?: string
    value?: number
}) {
    if (!GA_MEASUREMENT_ID) return

    window.gtag?.('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
}

// Common event trackers
export const analytics = {
    // User events
    signUp: () => trackEvent({ action: 'sign_up', category: 'engagement' }),
    signIn: () => trackEvent({ action: 'login', category: 'engagement' }),

    // Prompt events
    createPrompt: () => trackEvent({ action: 'create_prompt', category: 'content' }),
    viewPrompt: (promptId: string) => trackEvent({
        action: 'view_prompt',
        category: 'content',
        label: promptId
    }),
    copyPrompt: (promptId: string) => trackEvent({
        action: 'copy_prompt',
        category: 'engagement',
        label: promptId
    }),
    ratePrompt: (rating: number) => trackEvent({
        action: 'rate_prompt',
        category: 'engagement',
        value: rating
    }),

    // Search events
    search: (query: string) => trackEvent({
        action: 'search',
        category: 'engagement',
        label: query
    }),

    // Collection events
    createCollection: () => trackEvent({ action: 'create_collection', category: 'content' }),
    addToFavorites: () => trackEvent({ action: 'add_to_favorites', category: 'engagement' }),

    // Theme events
    toggleTheme: (theme: string) => trackEvent({
        action: 'toggle_theme',
        category: 'settings',
        label: theme
    }),

    // Language events
    changeLanguage: (language: string) => trackEvent({
        action: 'change_language',
        category: 'settings',
        label: language
    }),
}
