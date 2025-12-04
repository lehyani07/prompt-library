'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface User {
    id: string
    name: string | null
    email: string
    role: string
    status: string
    createdAt: Date
    _count: {
        prompts: number
    }
}

export default function UsersTable({ users }: { users: User[] }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { t } = useLanguage()

    async function updateUser(id: string, data: any) {
        setIsLoading(true)
        try {
            await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            router.refresh()
        } catch (error) {
            console.error('Failed to update user', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusTranslation = (status: string) => {
        if (status === 'ACTIVE') return t.admin.users.statuses.active
        if (status === 'BANNED') return t.admin.users.statuses.banned
        return t.admin.users.statuses.inactive
    }

    const getRoleTranslation = (role: string) => {
        if (role === 'USER') return t.admin.users.roles.user
        if (role === 'MODERATOR') return t.admin.users.roles.moderator
        if (role === 'ADMIN') return t.admin.users.roles.admin
        return role
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.users.user}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.users.role}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.users.status}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.users.prompts}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.users.joined}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.users.actions}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                        {user.name?.[0] || user.email[0].toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{user.name || t.admin.users.noName}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={user.role}
                                    onChange={(e) => updateUser(user.id, { role: e.target.value })}
                                    disabled={isLoading}
                                    className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="USER">{t.admin.users.roles.user}</option>
                                    <option value="MODERATOR">{t.admin.users.roles.moderator}</option>
                                    <option value="ADMIN">{t.admin.users.roles.admin}</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                        user.status === 'BANNED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {getStatusTranslation(user.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user._count.prompts}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => updateUser(user.id, { status: user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' })}
                                    disabled={isLoading}
                                    className={`text-sm ${user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                >
                                    {user.status === 'ACTIVE' ? t.admin.users.ban : t.admin.users.activate}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
