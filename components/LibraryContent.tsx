'use client'

import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface LibraryContentProps {
    user: any // Replace with proper type
}

export default function LibraryContent({ user }: LibraryContentProps) {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">{t.library.title}</h1>
                    <Link
                        href="/prompts/new"
                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        {t.prompt.new}
                    </Link>
                </div>

                {/* My Prompts */}
                <section className="mb-12">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">{t.library.tabs.myPrompts}</h2>
                    {user?.prompts.length === 0 ? (
                        <p className="text-gray-500">{t.library.emptyPrompts}</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {user?.prompts.map((prompt: any) => (
                                <Link
                                    key={prompt.id}
                                    href={`/prompts/${prompt.id}`}
                                    className="block rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {prompt.title}
                                        </h3>
                                        {!prompt.isPublic && (
                                            <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-600">
                                                {t.prompt.private}
                                            </span>
                                        )}
                                    </div>
                                    {prompt.description && (
                                        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                            {prompt.description}
                                        </p>
                                    )}
                                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex gap-3">
                                            <span>⭐ {prompt._count.ratings}</span>
                                            <span>❤️ {prompt._count.favorites}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Favorites */}
                <section className="mb-12">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">{t.library.tabs.favorites}</h2>
                    {user?.favorites.length === 0 ? (
                        <p className="text-gray-500">{t.library.emptyFavorites}</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {user?.favorites.map((favorite: any) => (
                                <Link
                                    key={favorite.id}
                                    href={`/prompts/${favorite.prompt.id}`}
                                    className="block rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {favorite.prompt.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {t.prompt.createdBy} {favorite.prompt.author.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Collections */}
                <section>
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">{t.library.tabs.collections}</h2>
                    {user?.collections.length === 0 ? (
                        <p className="text-gray-500">{t.library.emptyCollections}</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {user?.collections.map((collection: any) => (
                                <div
                                    key={collection.id}
                                    className="rounded-lg border bg-white p-6 shadow-sm"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {collection.name}
                                    </h3>
                                    {collection.description && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            {collection.description}
                                        </p>
                                    )}
                                    <p className="mt-4 text-sm text-gray-500">
                                        {collection._count.prompts} {t.common.appName === "Prompt Library" ? "prompts" : "برومبت"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
