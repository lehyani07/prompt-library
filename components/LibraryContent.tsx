'use client'

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { getCategoryTranslation } from "@/lib/i18n/categoryTranslations"
import { useState } from "react"
import { useRouter } from "next/navigation"
import CreateCollectionModal from "@/components/collections/CreateCollectionModal"

interface LibraryContentProps {
    user: any
}

type TabType = 'prompts' | 'favorites' | 'collections'

export default function LibraryContent({ user }: LibraryContentProps) {
    const { t, language } = useLanguage()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<TabType>('prompts')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    // Get current tab data
    const getCurrentData = () => {
        switch (activeTab) {
            case 'prompts':
                return user?.prompts || []
            case 'favorites':
                return user?.favorites || []
            case 'collections':
                return user?.collections || []
            default:
                return []
        }
    }

    const currentData = getCurrentData()
    const totalPages = Math.ceil(currentData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = currentData.slice(startIndex, endIndex)

    // Handle tab change
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab)
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-neutral-bg-page font-sans text-neutral-text-primary relative overflow-hidden isolate">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary-base/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
            <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary-base/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 z-0"></div>

            <main className="relative z-10 mx-auto max-w-7xl px-4 pt-4 pb-12 md:px-8 md:pt-6 md:pb-16">

                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base">
                        {t.library.title}
                    </h1>
                    <p className="mt-3 text-lg text-neutral-text-secondary max-w-2xl mx-auto">
                        {t.library.subtitle}
                    </p>
                    <div className="mx-auto mt-6 h-px w-1/2 bg-linear-to-r from-transparent via-neutral-border-subtle to-transparent"></div>
                </div>

                {/* Tabs Navigation */}
                <div className="mb-5 flex justify-center gap-4">
                    <button
                        onClick={() => handleTabChange('prompts')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'prompts'
                            ? 'bg-linear-to-r from-primary-base to-secondary-base text-white shadow-button'
                            : 'bg-white/80 text-neutral-text-secondary hover:bg-primary-base/10 hover:text-primary-base border border-neutral-border-subtle'
                            }`}
                    >
                        {t.library.tabs.myPrompts}
                    </button>
                    <button
                        onClick={() => handleTabChange('favorites')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'favorites'
                            ? 'bg-linear-to-r from-primary-base to-secondary-base text-white shadow-button'
                            : 'bg-white/80 text-neutral-text-secondary hover:bg-primary-base/10 hover:text-primary-base border border-neutral-border-subtle'
                            }`}
                    >
                        {t.library.tabs.favorites}
                    </button>
                    <button
                        onClick={() => handleTabChange('collections')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === 'collections'
                            ? 'bg-linear-to-r from-primary-base to-secondary-base text-white shadow-button'
                            : 'bg-white/80 text-neutral-text-secondary hover:bg-primary-base/10 hover:text-primary-base border border-neutral-border-subtle'
                            }`}
                    >
                        {t.library.tabs.collections}
                    </button>
                </div>

                {/* Content Grid */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-base/10 shadow-floating p-4 md:p-6">
                    {/* Actions Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-neutral-text-primary">
                            {activeTab === 'prompts' && t.library.tabs.myPrompts}
                            {activeTab === 'favorites' && t.library.tabs.favorites}
                            {activeTab === 'collections' && t.library.tabs.collections}
                        </h2>
                        {activeTab === 'prompts' && (
                            <Link
                                href="/prompts/new"
                                className="px-4 py-2 bg-linear-to-r from-primary-base to-secondary-base text-white rounded-lg font-semibold hover:shadow-button transition-all text-sm"
                            >
                                {t.prompt.new}
                            </Link>
                        )}
                        {activeTab === 'collections' && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-4 py-2 bg-linear-to-r from-primary-base to-secondary-base text-white rounded-lg font-semibold hover:shadow-button transition-all text-sm"
                            >
                                {t.library.createCollection}
                            </button>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {paginatedData.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-neutral-border-subtle">
                                <div className="text-4xl mb-4">📚</div>
                                <p className="text-neutral-text-secondary text-lg font-medium">
                                    {activeTab === 'prompts' && t.library.emptyPrompts}
                                    {activeTab === 'favorites' && t.library.emptyFavorites}
                                    {activeTab === 'collections' && t.library.emptyCollections}
                                </p>
                                {activeTab === 'prompts' && (
                                    <Link
                                        href="/prompts/new"
                                        className="mt-4 px-6 py-2 bg-linear-to-r from-primary-base to-secondary-base text-white rounded-lg font-semibold hover:shadow-button transition-all"
                                    >
                                        {t.prompt.new}
                                    </Link>
                                )}
                                {activeTab === 'collections' && (
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="mt-4 px-6 py-2 bg-linear-to-r from-primary-base to-secondary-base text-white rounded-lg font-semibold hover:shadow-button transition-all"
                                    >
                                        {t.library.createCollection}
                                    </button>
                                )}
                            </div>
                        ) : (
                            paginatedData.map((item: any, index: number) => {
                                const gradients = [
                                    'bg-linear-to-br from-blue-50 via-white to-indigo-50',
                                    'bg-linear-to-br from-purple-50 via-white to-pink-50',
                                    'bg-linear-to-br from-green-50 via-white to-emerald-50',
                                    'bg-linear-to-br from-amber-50 via-white to-orange-50',
                                    'bg-linear-to-br from-cyan-50 via-white to-teal-50',
                                    'bg-linear-to-br from-rose-50 via-white to-red-50',
                                ];
                                const gradientClass = gradients[(startIndex + index) % gradients.length];

                                // Render based on active tab
                                if (activeTab === 'prompts') {
                                    return (
                                        <div
                                            key={item.id}
                                            className={`group flex flex-col justify-between rounded-xl ${gradientClass} p-6 shadow-card hover:shadow-floating transition-all duration-300 border border-white/50 hover:border-primary-base/30 relative overflow-hidden`}
                                        >
                                            <div className="absolute inset-0 bg-linear-to-br from-primary-base/10 to-secondary-base/10 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                                            <div className="absolute inset-0 bg-linear-to-br from-primary-base/5 to-secondary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                            <div className="relative z-10">
                                                <div className="flex items-start justify-between mb-3">
                                                    {item.category && (
                                                        <span className="inline-flex items-center rounded-full bg-primary-base/10 px-2.5 py-0.5 text-xs font-medium text-primary-base">
                                                            {getCategoryTranslation(item.category.name, language)}
                                                        </span>
                                                    )}
                                                    {!item.isPublic && (
                                                        <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                                            {t.prompt.private}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-lg font-bold text-neutral-text-primary mb-2 group-hover:text-primary-base transition-colors">
                                                    {item.title}
                                                </h3>

                                                {item.description && (
                                                    <p className="text-sm text-neutral-text-secondary line-clamp-3 mb-4 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="relative z-10 mt-4 pt-4 border-t border-neutral-border-subtle flex items-center justify-end">
                                                <Link
                                                    href={`/prompts/${item.id}`}
                                                    className="text-sm font-semibold text-primary-base hover:text-primary-hover transition-colors"
                                                >
                                                    {t.common.viewDetails}
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                } else if (activeTab === 'favorites') {
                                    const prompt = item.prompt
                                    return (
                                        <div
                                            key={item.id}
                                            className={`group flex flex-col justify-between rounded-xl ${gradientClass} p-6 shadow-card hover:shadow-floating transition-all duration-300 border border-white/50 hover:border-primary-base/30 relative overflow-hidden`}
                                        >
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

                                                <p className="text-sm text-neutral-text-secondary mb-4">
                                                    {t.prompt.createdBy} {prompt.author.name}
                                                </p>
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
                                } else {
                                    // Collections
                                    return (
                                        <div
                                            key={item.id}
                                            className={`group flex flex-col justify-between rounded-xl ${gradientClass} p-6 shadow-card hover:shadow-floating transition-all duration-300 border border-white/50 hover:border-primary-base/30 relative overflow-hidden`}
                                        >
                                            <div className="absolute inset-0 bg-linear-to-br from-primary-base/10 to-secondary-base/10 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                                            <div className="absolute inset-0 bg-linear-to-br from-primary-base/5 to-secondary-base/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                            <div className="relative z-10">
                                                <h3 className="text-lg font-bold text-neutral-text-primary mb-2 group-hover:text-primary-base transition-colors">
                                                    {item.name}
                                                </h3>

                                                {item.description && (
                                                    <p className="text-sm text-neutral-text-secondary line-clamp-3 mb-4 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}

                                                <p className="text-sm text-neutral-text-secondary">
                                                    {item._count.prompts} {t.common.appName === "Prompt Library" ? "prompts" : "برومبت"}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {paginatedData.length > 0 && totalPages > 1 && (
                        <div className="relative z-20 mt-5 flex items-center justify-center gap-2">
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
            </main>

            <CreateCollectionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    )
}
