'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    _count: {
        prompts: number
    }
}

export default function CategoriesPageContent({ categories }: { categories: Category[] }) {
    const { t, direction } = useLanguage()
    const isRTL = direction === 'rtl'

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{t.admin.categories.title}</h1>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ minWidth: '200px' }}>{t.admin.categories.name}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ width: '150px' }}>{t.admin.categories.slug}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ minWidth: '300px' }}>{t.admin.categories.description}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-l border-r border-gray-300 bg-gray-100`} style={{ width: '120px' }}>{t.admin.categories.prompts}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2.5 text-sm font-medium text-gray-900 border-r border-gray-200">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                                        <code className="px-2 py-1 bg-gray-100 rounded text-xs">{category.slug}</code>
                                    </td>
                                    <td className="px-4 py-2.5 text-sm text-gray-500 border-r border-gray-200">
                                        {category.description || '-'}
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-center text-sm text-gray-500 border-l border-r border-gray-200">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-base/10 text-primary-base">
                                            {category._count.prompts}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}









