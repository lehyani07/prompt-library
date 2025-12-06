'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getCategoryTranslation } from '@/lib/i18n/categoryTranslations'

interface FilterPanelProps {
    categories: any[]
    selectedCategory: string
    onCategoryChange: (category: string) => void
    sortBy: string
    onSortChange: (sort: string) => void
    showPublicOnly?: boolean
    onPublicOnlyChange?: (value: boolean) => void
}

export default function FilterPanel({
    categories,
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
    showPublicOnly,
    onPublicOnlyChange,
}: FilterPanelProps) {
    const { t, language } = useLanguage()

    const sortOptions = [
        { value: 'recent', label: language === 'ar' ? 'الأحدث' : 'Most Recent' },
        { value: 'popular', label: language === 'ar' ? 'الأكثر شعبية' : 'Most Popular' },
        { value: 'rating', label: language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated' },
        { value: 'views', label: language === 'ar' ? 'الأكثر مشاهدة' : 'Most Viewed' },
    ]

    return (
        <div className="bg-neutral-bg-card rounded-lg shadow-card p-6 space-y-6">
            {/* Categories */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-text-primary mb-3">
                    {t.common.categories}
                </h3>
                <div className="space-y-2">
                    <button
                        onClick={() => onCategoryChange('all')}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${selectedCategory === 'all'
                                ? 'bg-primary-base text-neutral-text-on-primary'
                                : 'hover:bg-neutral-bg-soft text-neutral-text-primary'
                            }`}
                    >
                        {t.common.allCategories}
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.slug)}
                            className={`w-full text-left px-4 py-2 rounded-md transition-colors ${selectedCategory === category.slug
                                    ? 'bg-primary-base text-neutral-text-on-primary'
                                    : 'hover:bg-neutral-bg-soft text-neutral-text-primary'
                                }`}
                        >
                            {getCategoryTranslation(category.slug, language)}
                            <span className="text-sm opacity-75 ml-2">({category._count?.prompts || 0})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Sort By */}
            <div>
                <h3 className="text-lg font-semibold text-neutral-text-primary mb-3">
                    {language === 'ar' ? 'ترتيب حسب' : 'Sort By'}
                </h3>
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-neutral-border-subtle bg-neutral-bg-card text-neutral-text-primary focus:outline-none focus:ring-2 focus:ring-primary-base"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Public Only Filter */}
            {onPublicOnlyChange && (
                <div>
                    <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showPublicOnly}
                            onChange={(e) => onPublicOnlyChange(e.target.checked)}
                            className="w-5 h-5 rounded border-neutral-border-subtle text-primary-base focus:ring-primary-base focus:ring-2"
                        />
                        <span className="text-neutral-text-primary">
                            {language === 'ar' ? 'عامة فقط' : 'Public Only'}
                        </span>
                    </label>
                </div>
            )}

            {/* Clear Filters */}
            <button
                onClick={() => {
                    onCategoryChange('all')
                    onSortChange('recent')
                    onPublicOnlyChange?.(true)
                }}
                className="w-full px-4 py-2 text-primary-base hover:text-primary-hover transition-colors text-sm font-medium"
            >
                {t.common.clearFilters}
            </button>
        </div>
    )
}
