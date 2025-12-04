'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

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

export default function PromptsTable({ prompts }: { prompts: Prompt[] }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function deletePrompt(id: string) {
        if (!confirm("Are you sure you want to delete this prompt?")) return

        setIsLoading(true)
        try {
            await fetch(`/api/admin/prompts/${id}`, {
                method: 'DELETE',
            })
            router.refresh()
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
            router.refresh()
        } catch (error) {
            console.error('Failed to update prompt', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {prompts.map((prompt) => (
                        <tr key={prompt.id}>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{prompt.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">{prompt.content.substring(0, 50)}...</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{prompt.author.name || 'Unknown'}</div>
                                <div className="text-sm text-gray-500">{prompt.author.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {prompt.category?.name || 'Uncategorized'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => togglePublic(prompt.id, prompt.isPublic)}
                                    disabled={isLoading}
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer
                    ${prompt.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                >
                                    {prompt.isPublic ? 'Public' : 'Private'}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>❤️ {prompt._count.favorites}</div>
                                <div>⭐ {prompt._count.ratings}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(prompt.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => deletePrompt(prompt.id)}
                                    disabled={isLoading}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
