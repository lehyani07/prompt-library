'use client'

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useState, useEffect } from "react"

interface HomeContentProps {
    session: any
    featuredPrompts: any[]
}

export default function HomeContent({ session, featuredPrompts }: HomeContentProps) {
    const { t } = useLanguage()
    const [currentIndex, setCurrentIndex] = useState(0)

    // Auto-rotate featured prompts
    useEffect(() => {
        if (featuredPrompts.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % featuredPrompts.length)
            }, 5000) // Slower rotation (5s)
            return () => clearInterval(interval)
        }
    }, [featuredPrompts.length])

    const gradients = [
        'from-blue-500 via-indigo-500 to-purple-500',
        'from-purple-500 via-pink-500 to-rose-500',
        'from-cyan-500 via-blue-500 to-indigo-500',
        'from-indigo-500 via-purple-500 to-pink-500',
        'from-sky-500 via-cyan-500 to-blue-500',
        'from-violet-500 via-purple-500 to-fuchsia-500'
    ]

    return (
        <div className="min-h-screen bg-neutral-bg-page">
            {/* Hero Section with Featured Prompt Carousel */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary-base/10 via-secondary-base/10 to-purple-100 py-20">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary-base/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary-base/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <main className="relative mx-auto max-w-7xl px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base via-secondary-base to-purple-600 mb-6">
                            {t.home.heroTitle}
                        </h1>
                        <p className="mt-6 text-xl text-neutral-text-secondary max-w-3xl mx-auto">
                            {t.home.heroSubtitle}
                        </p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            {session ? (
                                <>
                                    <Link
                                        href="/explore"
                                        className="group relative px-8 py-4 text-lg font-bold bg-linear-to-r from-primary-base to-secondary-base text-white rounded-lg shadow-button hover:shadow-floating transition-all duration-300 hover:scale-105 overflow-hidden"
                                    >
                                        <span className="relative z-10">{t.common.explore}</span>
                                        <div className="absolute inset-0 bg-linear-to-r from-secondary-base to-primary-base opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                    <Link
                                        href="/prompts/new"
                                        className="px-8 py-4 text-lg font-bold border-2 border-primary-base text-primary-base rounded-lg hover:bg-primary-base hover:text-white transition-all duration-300 hover:scale-105 shadow-sm"
                                    >
                                        {t.prompt.new}
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href="/auth/signup"
                                    className="group relative px-8 py-4 text-lg font-bold bg-linear-to-r from-primary-base to-secondary-base text-white rounded-lg shadow-button hover:shadow-floating transition-all duration-300 hover:scale-105 overflow-hidden"
                                >
                                    <span className="relative z-10">{t.home.getStarted}</span>
                                    <div className="absolute inset-0 bg-linear-to-r from-secondary-base to-primary-base opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Featured Prompts Carousel */}
                    {featuredPrompts.length > 0 && (
                        <div className="mt-16 max-w-xl mx-auto">
                            <h2 className="text-2xl font-bold text-center mb-8 text-neutral-text-primary">
                                ✨ {t.home.features.discover.title}
                            </h2>
                            <div className="relative h-[240px]">
                                {featuredPrompts.map((prompt, index) => {
                                    const isActive = index === currentIndex
                                    const isPrev = featuredPrompts.length > 1 && index === (currentIndex - 1 + featuredPrompts.length) % featuredPrompts.length
                                    const isNext = featuredPrompts.length > 1 && index === (currentIndex + 1) % featuredPrompts.length

                                    let position = 'translate-x-0 scale-75 opacity-0 z-0'
                                    if (isActive) position = 'translate-x-0 scale-100 opacity-100 z-20'
                                    else if (isPrev) position = '-translate-x-[60%] scale-90 opacity-40 z-10'
                                    else if (isNext) position = 'translate-x-[60%] scale-90 opacity-40 z-10'

                                    // If only 1 item, always center
                                    if (featuredPrompts.length === 1) position = 'translate-x-0 scale-100 opacity-100 z-20'

                                    return (
                                        <div
                                            key={prompt.id}
                                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${position}`}
                                        >
                                            <Link href={`/prompts/${prompt.id}`} className="block h-full">
                                                <div className={`h-full bg-linear-to-br ${gradients[index % gradients.length]} rounded-2xl shadow-floating p-8 text-white relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300`}>
                                                    {/* Decorative elements */}
                                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20"></div>
                                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl -ml-16 -mb-16"></div>

                                                    <div className="relative z-10 h-full flex flex-col justify-center text-center">
                                                        {/* Category Badge */}
                                                        {prompt.category && (
                                                            <span className="inline-flex items-center justify-center w-fit mx-auto rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-semibold mb-4">
                                                                📁 {prompt.category.name}
                                                            </span>
                                                        )}

                                                        {/* Title */}
                                                        <h3 className="text-2xl font-bold mb-3 line-clamp-2">
                                                            {prompt.title}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-white/90 line-clamp-3">
                                                            {prompt.description || "No description available"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Carousel Indicators */}
                            <div className="flex justify-center gap-2 mt-8">
                                {featuredPrompts.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'w-8 bg-primary-base'
                                            : 'w-2 bg-neutral-border-subtle hover:bg-primary-base/50'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-neutral-bg-card">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-neutral-text-primary">
                        {t.home.features.discover.title}
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="group relative rounded-2xl bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-card hover:shadow-floating transition-all duration-300 border border-neutral-border-subtle hover:border-blue-200 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-200/30 to-transparent rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="mb-4 text-5xl">📚</div>
                                <h3 className="text-xl font-bold text-neutral-text-primary mb-3">
                                    {t.home.features.discover.title}
                                </h3>
                                <p className="text-neutral-text-secondary leading-relaxed">
                                    {t.home.features.discover.desc}
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative rounded-2xl bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 p-8 shadow-card hover:shadow-floating transition-all duration-300 border border-neutral-border-subtle hover:border-purple-200 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-200/30 to-transparent rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="mb-4 text-5xl">✨</div>
                                <h3 className="text-xl font-bold text-neutral-text-primary mb-3">
                                    {t.home.features.share.title}
                                </h3>
                                <p className="text-neutral-text-secondary leading-relaxed">
                                    {t.home.features.share.desc}
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative rounded-2xl bg-linear-to-br from-cyan-50 via-blue-50 to-indigo-50 p-8 shadow-card hover:shadow-floating transition-all duration-300 border border-neutral-border-subtle hover:border-cyan-200 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-200/30 to-transparent rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative z-10">
                                <div className="mb-4 text-5xl">⭐</div>
                                <h3 className="text-xl font-bold text-neutral-text-primary mb-3">
                                    {t.home.features.organize.title}
                                </h3>
                                <p className="text-neutral-text-secondary leading-relaxed">
                                    {t.home.features.organize.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
