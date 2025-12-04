'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { getCategoryTranslation } from "@/lib/i18n/categoryTranslations"

interface PromptDetailsContentProps {
    prompt: any
    session: any
    averageRating: number
    similarPrompts: any[]
}

export default function PromptDetailsContent({ prompt, session, averageRating, similarPrompts }: PromptDetailsContentProps) {
    const { t, language } = useLanguage()
    const [copied, setCopied] = useState(false)
    const [viewCount, setViewCount] = useState(prompt.viewCount || 0)
    const [copyCount, setCopyCount] = useState(prompt.copyCount || 0)

    // Track view on mount
    useEffect(() => {
        const trackView = async () => {
            try {
                const response = await fetch(`/api/prompts/${prompt.id}/view`, {
                    method: 'POST'
                })
                if (response.ok) {
                    const data = await response.json()
                    setViewCount(data.viewCount)
                }
            } catch (error) {
                console.error('Failed to track view:', error)
            }
        }
        trackView()
    }, [prompt.id])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.content)
            setCopied(true)

            // Track copy
            const response = await fetch(`/api/prompts/${prompt.id}/copy`, {
                method: 'POST'
            })
            if (response.ok) {
                const data = await response.json()
                setCopyCount(data.copyCount)
            }

            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy:', error)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-bg-page font-sans text-neutral-text-primary relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary-base/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary-base/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <main className="relative mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
                {/* Breadcrumb */}
                <div className="mb-4 text-sm text-neutral-text-secondary">
                    <Link href="/explore" className="hover:text-primary-base transition-colors">
                        {t.common.explore}
                    </Link>
                    {" / "}
                    <span className="text-neutral-text-primary font-medium">{prompt.title}</span>
                </div>

                {/* Prompt Details Card */}
                <div className="rounded-xl bg-white/80 backdrop-blur-md p-4 md:p-6 shadow-card border border-white/20 mb-6">
                    <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base mb-2">
                                {prompt.title}
                            </h1>
                            {prompt.category && (
                                <span className="inline-flex items-center rounded-full bg-primary-base/10 px-3 py-1 text-sm font-medium text-primary-base">
                                    {getCategoryTranslation(prompt.category.name, language)}
                                </span>
                            )}
                        </div>
                        {session?.user?.email === prompt.author.email && (
                            <Link
                                href={`/prompts/${prompt.id}/edit`}
                                className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-primary-base to-secondary-base px-4 py-2 text-sm font-semibold text-white shadow-button hover:shadow-floating transition-all duration-300"
                            >
                                {t.common.edit}
                            </Link>
                        )}
                    </div>

                    {prompt.description && (
                        <p className="mb-4 text-base text-neutral-text-secondary leading-relaxed">{prompt.description}</p>
                    )}

                    {/* Prompt Content Box - Improved readability */}
                    <div className="mb-3 rounded-lg bg-neutral-50 p-4 border border-neutral-border-subtle">
                        <h2 className="mb-2 text-xs font-semibold text-neutral-text-secondary uppercase tracking-wide">
                            {t.prompt.content}
                        </h2>
                        <pre className="whitespace-pre-wrap font-mono text-sm text-neutral-900 leading-relaxed font-medium">
                            {prompt.content}
                        </pre>
                    </div>

                    {/* Copy Button */}
                    <div className="mb-4">
                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary-base/10 hover:bg-primary-base/20 px-4 py-2 text-sm font-semibold text-primary-base transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                                <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
                            </svg>
                            {copied ? t.common.copied : t.common.copy}
                        </button>
                    </div>

                    {/* Footer with stats - Improved spacing and added new stats */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-neutral-border-subtle pt-4">
                        <div className="text-sm text-neutral-text-secondary">
                            {t.prompt.createdBy} <span className="font-semibold text-neutral-text-primary">{prompt.author.name || prompt.author.email}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm">
                            <span className="flex items-center gap-1 text-accent-warning font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                                {averageRating.toFixed(1)} ({prompt._count.ratings})
                            </span>
                            <span className="flex items-center gap-1 text-accent-error font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                                {prompt._count.favorites}
                            </span>
                            <span className="flex items-center gap-1 text-primary-base font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                </svg>
                                {viewCount}
                            </span>
                            <span className="flex items-center gap-1 text-secondary-base font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
                                </svg>
                                {copyCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Similar Prompts Section */}
                {similarPrompts.length > 0 && (
                    <div className="rounded-xl bg-white/80 backdrop-blur-md p-4 md:p-6 shadow-card border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl md:text-2xl font-bold text-neutral-text-primary">
                                {t.prompt.similarPrompts}
                            </h2>
                            {prompt.categoryId && (
                                <Link
                                    href={`/explore?category=${prompt.category.slug}`}
                                    className="text-sm font-medium text-primary-base hover:text-secondary-base transition-colors"
                                >
                                    {t.prompt.viewAll} →
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {similarPrompts.map((similar: any) => {
                                const avgRating = similar.ratings?.length > 0
                                    ? similar.ratings.reduce((acc: number, r: any) => acc + r.value, 0) / similar.ratings.length
                                    : 0

                                return (
                                    <Link
                                        key={similar.id}
                                        href={`/prompts/${similar.id}`}
                                        className="block rounded-lg bg-neutral-50 hover:bg-neutral-100 p-3 border border-neutral-border-subtle hover:border-primary-base/30 transition-all duration-200"
                                    >
                                        <h3 className="font-semibold text-neutral-text-primary mb-1 line-clamp-1">
                                            {similar.title}
                                        </h3>
                                        {similar.description && (
                                            <p className="text-sm text-neutral-text-secondary mb-2 line-clamp-2">
                                                {similar.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-neutral-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-accent-warning">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                                {avgRating.toFixed(1)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-accent-error">
                                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                                </svg>
                                                {similar._count.favorites}
                                            </span>
                                            <span className="text-neutral-text-secondary">•</span>
                                            <span>{similar.author.name || similar.author.email.split('@')[0]}</span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Ratings Section */}
                {prompt.ratings.length > 0 && (
                    <div className="mt-6 rounded-xl bg-white/80 backdrop-blur-md p-4 md:p-6 shadow-card border border-white/20">
                        <h2 className="mb-4 text-xl md:text-2xl font-bold text-neutral-text-primary">
                            {t.prompt.ratings}
                        </h2>
                        <div className="space-y-3">
                            {prompt.ratings.map((rating: any) => (
                                <div key={rating.id} className="border-b border-neutral-border-subtle pb-3 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-neutral-text-primary">{rating.user.name}</span>
                                        <div className="flex items-center gap-1 text-accent-warning">
                                            {Array.from({ length: rating.value }).map((_, i) => (
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    {rating.comment && (
                                        <p className="text-sm text-neutral-text-secondary leading-relaxed">{rating.comment}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
