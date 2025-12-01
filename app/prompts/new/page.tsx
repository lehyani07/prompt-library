"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Category {
    id: string
    name: string
}

export default function NewPromptPage() {
    const router = useRouter()
    const { t } = useLanguage()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [categories, setCategories] = useState<Category[]>([])

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        categoryId: "",
        isPublic: true
    })

    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories")
                if (response.ok) {
                    const data = await response.json()
                    setCategories(data)
                    if (data.length > 0) {
                        setFormData(prev => ({ ...prev, categoryId: data[0].id }))
                    }
                }
            } catch (err) {
                console.error("Failed to fetch categories", err)
            }
        }

        fetchCategories()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch("/api/prompts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || t.common.error)
            }

            const newPrompt = await response.json()
            router.push(`/prompts/${newPrompt.id}`)
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="mx-auto max-w-2xl px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t.prompt.new}</h1>
                    <p className="mt-2 text-gray-600">{t.prompt.newSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-8 shadow-sm">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            {t.prompt.title}
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            {t.prompt.category}
                        </label>
                        <select
                            id="category"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            <option value="" disabled>{t.prompt.selectCategory}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            {t.prompt.description}
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            {t.prompt.content}
                        </label>
                        <textarea
                            id="content"
                            required
                            rows={6}
                            className="mt-1 block w-full font-mono text-sm rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="isPublic"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        />
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                            {t.prompt.isPublic}
                        </label>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link
                            href="/library"
                            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {t.common.cancel}
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? t.common.loading : t.common.create}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}
