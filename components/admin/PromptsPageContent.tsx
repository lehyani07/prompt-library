'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"
import PromptsTable from "@/components/admin/PromptsTable"

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

export default function PromptsPageContent({ 
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
    const { t } = useLanguage()

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.admin.prompts.title}</h1>

            <div className="flex-1 flex flex-col min-h-0">
                <PromptsTable 
                    prompts={prompts} 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    )
}

