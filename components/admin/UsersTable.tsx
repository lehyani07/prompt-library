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
    const { t, direction } = useLanguage()
    const isRTL = direction === 'rtl'

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
            <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ minWidth: '250px' }}>{t.admin.users.user}</th>
                            <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ width: '150px' }}>{t.admin.users.role}</th>
                            <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-r border-gray-300`} style={{ width: '120px' }}>{t.admin.users.status}</th>
                            <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-r border-gray-300`} style={{ width: '100px' }}>{t.admin.users.prompts}</th>
                            <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-l border-r border-gray-300 bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`} style={{ width: '120px' }}>{t.admin.users.joined}</th>
                            <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-l border-r border-gray-300`} style={{ width: '120px' }}>{t.admin.users.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-2.5 border-r border-gray-200">
                                    <div className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-linear-to-r from-primary-base to-secondary-base flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                            {user.name?.[0] || user.email[0].toUpperCase()}
                                        </div>
                                        <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                                            <div className="text-sm font-medium text-gray-900">{user.name || t.admin.users.noName}</div>
                                            <div className="text-xs text-gray-500 truncate" style={{ maxWidth: '200px' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 border-r border-gray-200">
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUser(user.id, { role: e.target.value })}
                                        disabled={isLoading}
                                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-base focus:ring focus:ring-primary-base/20 focus:ring-opacity-50 w-full"
                                    >
                                        <option value="USER">{t.admin.users.roles.user}</option>
                                        <option value="MODERATOR">{t.admin.users.roles.moderator}</option>
                                        <option value="ADMIN">{t.admin.users.roles.admin}</option>
                                    </select>
                                </td>
                                <td className="px-4 py-2.5 text-center border-r border-gray-200">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                  ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                            user.status === 'BANNED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {getStatusTranslation(user.status)}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap text-center text-sm text-gray-500 border-r border-gray-200">
                                    {user._count.prompts}
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 border-l border-r border-gray-200">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap text-center border-l border-r border-gray-200">
                                    <button
                                        onClick={() => updateUser(user.id, { status: user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' })}
                                        disabled={isLoading}
                                        className={`text-sm font-medium transition-colors ${user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {user.status === 'ACTIVE' ? t.admin.users.ban : t.admin.users.activate}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
