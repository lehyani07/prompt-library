'use client'

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface PromptDetailsContentProps {
    prompt: any
    session: any
    averageRating: number
}

export default function PromptDetailsContent({ prompt, session, averageRating }: PromptDetailsContentProps) {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-neutral-bg-page font-sans text-neutral-text-primary relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary-base/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary-base/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <main className="relative mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-neutral-text-secondary">
                    <Link href="/explore" className="hover:text-primary-base transition-colors">
                        {t.common.explore}
                    </Link>
                    {" / "}
                    <span className="text-neutral-text-primary font-medium">{prompt.title}</span>
                </div>

                {/* Prompt Details Card */}
                <div className="rounded-xl bg-white/80 backdrop-blur-md p-6 md:p-8 shadow-card border border-white/20 mb-8">
                    <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base mb-3">
                                {prompt.title}
                            </h1>
                            {prompt.category && (
                                <span className="inline-flex items-center rounded-full bg-primary-base/10 px-3 py-1 text-sm font-medium text-primary-base">
                                    {prompt.category.name}
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
                        <p className="mb-6 text-lg text-neutral-text-secondary leading-relaxed">{prompt.description}</p>
                    )}

                    {/* Prompt Content Box */}
                    <div className="mb-6 rounded-lg bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4 border border-primary-base/20">
                        <h2 className="mb-3 text-sm font-semibold text-neutral-text-primary uppercase tracking-wide">
                            {t.prompt.content}
                        </h2>
                        <pre className="whitespace-pre-wrap font-mono text-sm text-neutral-text-primary leading-relaxed">
                            {prompt.content}
                        </pre>
                    </div>

                    {/* Footer with stats */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-neutral-border-subtle pt-6">
                        <div className="text-sm text-neutral-text-secondary">
                            {t.prompt.createdBy} <span className="font-semibold text-neutral-text-primary">{prompt.author.name || prompt.author.email}</span>
                        </div>
                        <div className="flex gap-4 text-sm">
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
                        </div>
                    </div>
                </div>

                {/* Ratings Section */}
                {prompt.ratings.length > 0 && (
                    <div className="rounded-xl bg-white/80 backdrop-blur-md p-6 md:p-8 shadow-card border border-white/20">
                        <h2 className="mb-6 text-2xl font-bold text-neutral-text-primary">
                            {t.prompt.ratings}
                        </h2>
                        <div className="space-y-4">
                            {prompt.ratings.map((rating: any) => (
                                <div key={rating.id} className="border-b border-neutral-border-subtle pb-4 last:border-0">
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
