'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const { t, language } = useLanguage()

    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const showPages = 5

        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border border-neutral-border-subtle bg-neutral-bg-card text-neutral-text-primary hover:bg-neutral-bg-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {t.common.prev}
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`px-4 py-2 rounded-md transition-colors ${page === currentPage
                            ? 'bg-primary-base text-neutral-text-on-primary'
                            : page === '...'
                                ? 'cursor-default text-neutral-text-secondary'
                                : 'border border-neutral-border-subtle bg-neutral-bg-card text-neutral-text-primary hover:bg-neutral-bg-soft'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border border-neutral-border-subtle bg-neutral-bg-card text-neutral-text-primary hover:bg-neutral-bg-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {t.common.next}
            </button>
        </div>
    )
}
