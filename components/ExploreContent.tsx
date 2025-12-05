'use client'

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { getCategoryTranslation } from "@/lib/i18n/categoryTranslations"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

interface ExploreContentProps {
    prompts: any[]
    categories: any[]
    session: any
}

export default function ExploreContent({ prompts, categories, session }: ExploreContentProps) {
    const { t, language } = useLanguage()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
    const [isFilterOpen, setIsFilterOpen] = useState(false) // Mobile filter toggle
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchQuery, selectedCategory)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleSearch = (query: string, category: string) => {
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        if (category) params.set("category", category)
        router.push(`/explore?${params.toString()}`)
    }

    const handleCategoryChange = (categorySlug: string) => {
        const newCategory = selectedCategory === categorySlug ? "" : categorySlug
        setSelectedCategory(newCategory)
        handleSearch(searchQuery, newCategory)
        setCurrentPage(1)
    }

    const handleReset = () => {
        setSearchQuery("")
        setSelectedCategory("")
        setCurrentPage(1)
        router.push("/explore")
    }

    // Pagination calculations
    const totalPages = Math.ceil(prompts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPrompts = prompts.slice(startIndex, endIndex)

    return (
        <div className="min-h-screen bg-neutral-bg-page font-sans text-neutral-text-primary relative overflow-hidden isolate">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary-base/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
            <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary-base/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 z-0"></div>

            <main className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-24 md:px-8 md:pt-12 md:pb-32">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base">
                        {t.common.explore}
                    </h1>
                    <p className="mt-3 text-lg text-neutral-text-secondary max-w-2xl mx-auto">
                        {t.home.features.discover.desc}
                    </p>
                    <div className="mx-auto mt-6 h-px w-1/2 bg-linear-to-r from-transparent via-neutral-border-subtle to-transparent"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters (Desktop) & Mobile Toggle */}
                    <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-card p-6 sticky top-24 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-neutral-text-primary">{t.common.filters}</h3>
                                <button onClick={handleReset} className="text-sm text-primary-base hover:text-primary-hover font-medium">
                                    {t.common.reset}
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                    {t.common.search}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t.common.keywords}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-border-subtle bg-white/50 px-4 py-2 text-sm focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                />
                            </div>

                            {/* Categories */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-text-secondary mb-3">
                                    {t.common.categories}
                                </label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleCategoryChange("")}
                                        className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedCategory === ""
                                            ? "bg-linear-to-r from-primary-base to-secondary-base text-white font-medium shadow-button"
                                            : "text-neutral-text-secondary hover:bg-primary-base/10 hover:text-primary-base"
                                            }`}
                                    >
                                        {t.common.allCategories}
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategoryChange(category.slug)}
                                            className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedCategory === category.slug
                                                ? "bg-linear-to-r from-primary-base to-secondary-base text-white font-medium shadow-button"
                                                : "text-neutral-text-secondary hover:bg-primary-base/10 hover:text-primary-base"
                                                }`}
                                        >
                                            {getCategoryTranslation(category.name, language)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Toggle Button */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full bg-white border border-neutral-border-subtle rounded-lg py-3 px-4 flex items-center justify-center gap-2 font-medium text-neutral-text-primary shadow-sm"
                        >
                            <span>{isFilterOpen ? t.common.hideFilters : t.common.showFilters}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        </button>
                    </div>

                    {/* Content Grid */}
                    <div className="flex-1">
                        {/* Cards Frame */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-base/10 shadow-floating p-6 md:p-8">
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {prompts.length === 0 ? (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-neutral-border-subtle">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <p className="text-neutral-text-secondary text-lg font-medium">{t.prompt.noPrompts}</p>
                                        <button onClick={handleReset} className="mt-4 text-primary-base hover:underline">
                                            {t.common.clearFilters}
                                        </button>
                                    </div>
                                ) : (
                                    currentPrompts.map((prompt, index) => {
                                        // Array of soft, pleasant gradient backgrounds
                                        const gradients = [
                                            'bg-linear-to-br from-blue-50 via-white to-indigo-50',
                                            'bg-linear-to-br from-purple-50 via-white to-pink-50',
                                            'bg-linear-to-br from-green-50 via-white to-emerald-50',
                                            'bg-linear-to-br from-amber-50 via-white to-orange-50',
                                            'bg-linear-to-br from-cyan-50 via-white to-teal-50',
                                            'bg-linear-to-br from-rose-50 via-white to-red-50',
                                        ];
                                        const gradientClass = gradients[(startIndex + index) % gradients.length];

                                        return (
                                            <div
                                                key={prompt.id}
                                                className={`group flex flex-col justify-between rounded-xl ${gradientClass} p-6 shadow-card hover:shadow-floating transition-all duration-300 border border-white/50 hover:border-primary-base/30 relative overflow-hidden`}
                                            >
                                                {/* Enhanced gradient overlay - stronger color always visible, lighter on hover */}
                                                <div className="absolute inset-0 bg-linear-to-br from-primary-base/10 to-secondary-base/10 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                                                <div className="absolute inset-0 bg-linear-to-br from-primary-base/5 to-secondary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                                <div className="relative z-10">
                                                    <div className="flex items-start justify-between mb-3">
                                                        {prompt.category && (
                                                            <span className="inline-flex items-center rounded-full bg-primary-base/10 px-2.5 py-0.5 text-xs font-medium text-primary-base">
                                                                {getCategoryTranslation(prompt.category.name, language)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="text-lg font-bold text-neutral-text-primary mb-2 group-hover:text-primary-base transition-colors">
                                                        {prompt.title}
                                                    </h3>

                                                    {prompt.description && (
                                                        <p className="text-sm text-neutral-text-secondary line-clamp-3 mb-4 leading-relaxed">
                                                            {prompt.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="relative z-10 mt-4 pt-4 border-t border-neutral-border-subtle flex items-center justify-end">
                                                    <Link
                                                        href={`/prompts/${prompt.id}`}
                                                        className="text-sm font-semibold text-primary-base hover:text-primary-hover transition-colors"
                                                    >
                                                        {t.common.viewDetails}
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {prompts.length > 0 && totalPages > 1 && (
                                <div className="relative z-20 mt-8 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg bg-white border border-neutral-border-subtle text-neutral-text-primary font-medium hover:bg-primary-base hover:text-white hover:border-primary-base transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-neutral-text-primary shadow-sm"
                                    >
                                        {t.common.prev}
                                    </button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-all shadow-sm ${currentPage === page
                                                    ? 'bg-linear-to-r from-primary-base to-secondary-base text-white shadow-button'
                                                    : 'bg-white border border-neutral-border-subtle text-neutral-text-secondary hover:bg-primary-base/10 hover:text-primary-base hover:border-primary-base/30'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg bg-white border border-neutral-border-subtle text-neutral-text-primary font-medium hover:bg-primary-base hover:text-white hover:border-primary-base transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-neutral-text-primary shadow-sm"
                                    >
                                        {t.common.next}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
