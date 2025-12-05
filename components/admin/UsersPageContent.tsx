'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"
import UsersTable from "@/components/admin/UsersTable"

interface User {
    id: string
    name: string | null
    email: string
    role: string
    status: string
    createdAt: Date
    _count: {
        prompts: number
        favorites: number
        ratings: number
    }
}

export default function UsersPageContent({ users }: { users: User[] }) {
    const { t } = useLanguage()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{t.admin.users.title}</h1>
            </div>

            <UsersTable users={users} />
        </div>
    )
}






