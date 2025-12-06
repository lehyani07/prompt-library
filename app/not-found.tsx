'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export default function NotFound() {
    const { t } = useLanguage()

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8 h-64 w-64 md:h-80 md:w-80">
                {/* Abstract 404 Visual - Using pure CSS/SVG to keep it lightweight but premium */}
                <svg className="h-full w-full drop-shadow-2xl" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="200" cy="150" r="100" className="fill-blue-50/50 animate-pulse" />
                    <circle cx="200" cy="150" r="70" className="fill-indigo-100/50" />

                    {/* 404 Text embedded in SVG for perfect scaling */}
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-primary-base" style={{ fontSize: '120px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
                        404
                    </text>

                    {/* Decorative Elements */}
                    <circle cx="80" cy="80" r="10" className="fill-secondary-base opacity-20 animate-bounce" style={{ animationDuration: '3s' }} />
                    <circle cx="320" cy="220" r="15" className="fill-primary-base opacity-20 animate-bounce" style={{ animationDuration: '4s' }} />
                    <rect x="300" y="50" width="20" height="20" rx="5" className="fill-accent-purple opacity-20 animate-spin-slow" style={{ transformOrigin: '310px 60px', animationDuration: '10s' }} />
                </svg>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-neutral-text-primary md:text-4xl">
                {t.errors.notFound.title}
            </h1>

            <p className="mb-8 max-w-md text-lg text-neutral-text-secondary">
                {t.errors.notFound.description}
            </p>

            <Link
                href="/"
                className="rounded-full bg-primary-base px-8 py-3.5 text-base font-semibold text-white shadow-button transition-all hover:bg-primary-hover hover:shadow-floating hover:-translate-y-0.5"
            >
                {t.errors.notFound.backHome}
            </Link>
        </div>
    )
}
