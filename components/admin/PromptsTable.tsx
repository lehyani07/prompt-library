'use client'

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Prompt {
    id: string
    title: string
    content: string
    isPublic: boolean
    createdAt: Date
    author: {
        name: string | null
        email: string
    }
    category: {
        name: string
    } | null
    _count: {
        favorites: number
        ratings: number
    }
}

export default function PromptsTable({
    prompts,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage
}: {
    prompts: Prompt[]
    currentPage: number
    totalPages: number
    totalCount: number
    itemsPerPage: number
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isPending, startTransition] = useTransition()
    const { t, direction } = useLanguage()
    const isRTL = direction === 'rtl'

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page === 1) {
            params.delete('page')
        } else {
            params.set('page', page.toString())
        }
        return `/admin/prompts?${params.toString()}`
    }

    async function deletePrompt(id: string) {
        if (!confirm(t.admin.prompts.deleteConfirm)) return

        setIsLoading(true)
        try {
            await fetch(`/api/admin/prompts/${id}`, {
                method: 'DELETE',
            })
            startTransition(() => {
                router.refresh()
            })
        } catch (error) {
            console.error('Failed to delete prompt', error)
        } finally {
            setIsLoading(false)
        }
    }

    async function togglePublic(id: string, currentStatus: boolean) {
        setIsLoading(true)
        try {
            await fetch(`/api/admin/prompts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublic: !currentStatus })
            })
            startTransition(() => {
                router.refresh()
            })
        } catch (error) {
            console.error('Failed to update prompt', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            // Show all pages if total pages <= maxVisible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            // Adjust range if near start or end
            if (currentPage <= 3) {
                end = 4
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 3
            }

            // Add ellipsis before if needed
            if (start > 2) {
                pages.push('...')
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            // Add ellipsis after if needed
            if (end < totalPages - 1) {
                pages.push('...')
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="bg-white shadow rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
                {prompts.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        {t.admin.prompts.noPrompts}
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className={`px-3 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ width: '50px' }}>#</th>
                                    <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ minWidth: '200px' }}>{t.admin.prompts.titleColumn}</th>
                                    <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ minWidth: '180px' }}>{t.admin.prompts.author}</th>
                                    <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ minWidth: '120px' }}>{t.admin.prompts.category}</th>
                                    <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-r border-gray-300`} style={{ width: '100px' }}>{t.admin.prompts.status}</th>
                                    <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-r border-gray-300`} style={{ width: '80px' }}>{t.admin.prompts.stats}</th>
                                    <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100 border-l border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ width: '110px' }}>{t.admin.prompts.created}</th>
                                    <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-l border-r border-gray-300`} style={{ width: '80px' }}>{t.admin.prompts.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {prompts.map((prompt, index) => (
                                    <tr key={prompt.id} className="hover:bg-gray-50 transition-colors">
                                        <td className={`px-3 py-2.5 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </td>
                                        <td className="px-4 py-2.5 border-r border-gray-200">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2" title={prompt.title}>
                                                {prompt.title}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 border-r border-gray-200">
                                            <div className="text-sm text-gray-900 truncate" title={prompt.author.name || prompt.author.email}>
                                                {prompt.author.name || t.admin.prompts.unknown}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate mt-0.5" title={prompt.author.email}>
                                                {prompt.author.email}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap border-r border-gray-200">
                                            <div className="text-sm text-gray-500 truncate" title={prompt.category?.name || t.admin.prompts.uncategorized}>
                                                {prompt.category?.name || t.admin.prompts.uncategorized}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap text-center border-r border-gray-200">
                                            <button
                                                onClick={() => togglePublic(prompt.id, prompt.isPublic)}
                                                disabled={isLoading || isPending}
                                                className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full cursor-pointer transition-colors
                                                ${prompt.isPublic ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} 
                                                ${isLoading || isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {prompt.isPublic ? t.admin.prompts.public : t.admin.prompts.private}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap text-center border-r border-gray-200">
                                            <div className="text-xs text-gray-500 leading-tight">
                                                <div>❤️ {prompt._count.favorites}</div>
                                                <div className="mt-0.5">⭐ {prompt._count.ratings}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap border-l border-r border-gray-200">
                                            <div className="text-sm text-gray-500">
                                                {new Date(prompt.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap text-center border-l border-r border-gray-200">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/prompts/${prompt.id}/edit?callbackUrl=/admin/prompts`}
                                                    className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors"
                                                >
                                                    {t.common.edit}
                                                </Link>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    onClick={() => deletePrompt(prompt.id)}
                                                    disabled={isLoading || isPending}
                                                    className={`text-red-600 hover:text-red-900 text-sm font-medium transition-colors ${isLoading || isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {t.admin.prompts.delete}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="bg-white shadow rounded-lg px-4 py-3 mt-4 flex items-center justify-center gap-4 border-t border-gray-200" dir={direction}>
                    {/* Previous Button */}
                    <Link
                        href={createPageUrl(Math.max(1, currentPage - 1))}
                        className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md ${currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed opacity-50'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        aria-disabled={currentPage === 1}
                    >
                        <span className="sr-only">Previous</span>
                        <svg
                            className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>

                    {/* Page Numbers */}
                    <nav className="flex items-center gap-1" aria-label="Pagination">
                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                </span>
                            ) : (
                                <Link
                                    key={page}
                                    href={createPageUrl(page as number)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </Link>
                            )
                        ))}
                    </nav>

                    {/* Next Button */}
                    <Link
                        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
                        className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md ${currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed opacity-50'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        aria-disabled={currentPage === totalPages}
                    >
                        <span className="sr-only">Next</span>
                        <svg
                            className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    )
}
