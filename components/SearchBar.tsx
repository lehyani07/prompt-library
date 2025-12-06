'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
    defaultValue?: string
}

export default function SearchBar({ onSearch, placeholder, defaultValue = '' }: SearchBarProps) {
    const { t } = useLanguage()
    const [query, setQuery] = useState(defaultValue)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    const handleClear = () => {
        setQuery('')
        onSearch('')
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder || t.common.searchPlaceholder}
                    className="w-full px-4 py-3 pr-24 rounded-lg border border-neutral-border-subtle bg-neutral-bg-card text-neutral-text-primary placeholder-neutral-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-base focus:border-transparent transition-all"
                />

                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-16 top-1/2 -translate-y-1/2 p-1 text-neutral-text-secondary hover:text-neutral-text-primary transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-base text-neutral-text-on-primary rounded-md hover:bg-primary-hover transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </form>
    )
}
