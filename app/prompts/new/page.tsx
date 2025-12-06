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
        <div className="min-h-screen bg-neutral-bg-page font-sans text-neutral-text-primary relative overflow-hidden isolate">
            {/* Decorative background elements */}
            <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary-base/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
            <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary-base/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 z-0"></div>

            <main className="relative z-10 mx-auto max-w-2xl px-6 py-10 md:py-16">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base md:text-4xl">
                        {t.prompt.new}
                    </h1>
                    <p className="mt-3 text-lg text-neutral-text-secondary">
                        {t.prompt.newSubtitle}
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-floating p-6 md:p-8 border border-white/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-neutral-text-primary mb-2">
                                {t.prompt.title}
                            </label>
                            <input
                                type="text"
                                id="title"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border-subtle bg-white text-neutral-text-primary placeholder-neutral-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-neutral-text-primary mb-2">
                                {t.prompt.category}
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-border-subtle bg-white text-neutral-text-primary focus:outline-none focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base transition-all appearance-none cursor-pointer"
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
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-neutral-text-secondary">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-neutral-text-primary mb-2">
                                {t.prompt.description}
                            </label>
                            <textarea
                                id="description"
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border-subtle bg-white text-neutral-text-primary placeholder-neutral-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base transition-all resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-semibold text-neutral-text-primary mb-2">
                                {t.prompt.content}
                            </label>
                            <textarea
                                id="content"
                                required
                                rows={8}
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-border-subtle bg-white text-neutral-text-primary placeholder-neutral-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base transition-all font-mono text-sm"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-neutral-bg-soft/50 rounded-xl border border-neutral-border-subtle">
                            <input
                                id="isPublic"
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-300 text-primary-base focus:ring-primary-base cursor-pointer"
                                checked={formData.isPublic}
                                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                            />
                            <label htmlFor="isPublic" className="text-sm font-medium text-neutral-text-primary cursor-pointer select-none">
                                {t.prompt.isPublic}
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-border-subtle">
                            <Link
                                href="/library"
                                className="px-6 py-2.5 rounded-full text-sm font-semibold text-neutral-text-secondary hover:text-neutral-text-primary hover:bg-neutral-bg-soft transition-colors"
                            >
                                {t.common.cancel}
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-2.5 rounded-full bg-linear-to-r from-primary-base to-secondary-base text-white text-sm font-bold shadow-button hover:shadow-floating hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? t.common.loading : t.common.create}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
