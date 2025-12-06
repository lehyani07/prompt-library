'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const { t } = useLanguage()

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error)
    }, [error])

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8 h-48 w-48 md:h-64 md:w-64">
                <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" className="stroke-red-100" strokeWidth="2" />
                    <path d="M12 8V12" className="stroke-accent-error" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 16H12.01" className="stroke-accent-error" strokeWidth="2" strokeLinecap="round" />

                    {/* Animated pulses */}
                    <circle cx="12" cy="12" r="8" className="stroke-red-50 animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                </svg>
            </div>

            <h2 className="mb-4 text-3xl font-bold text-neutral-text-primary md:text-4xl">
                {t.errors.serverError.title}
            </h2>

            <p className="mb-8 max-w-md text-lg text-neutral-text-secondary">
                {t.errors.serverError.description}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
                <button
                    onClick={reset}
                    className="rounded-full bg-primary-base px-8 py-3.5 text-base font-semibold text-white shadow-button transition-all hover:bg-primary-hover hover:shadow-floating hover:-translate-y-0.5"
                >
                    {t.errors.serverError.retry}
                </button>

                <Link
                    href="/"
                    className="rounded-full border border-neutral-border-subtle bg-white px-8 py-3.5 text-base font-semibold text-neutral-text-primary transition-all hover:bg-neutral-bg-soft hover:shadow-sm"
                >
                    {t.errors.serverError.backHome}
                </Link>
            </div>
        </div>
    )
}
