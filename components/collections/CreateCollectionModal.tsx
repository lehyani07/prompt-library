'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useRouter } from 'next/navigation'

interface CreateCollectionModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreateCollectionModal({ isOpen, onClose }: CreateCollectionModalProps) {
    const { t } = useLanguage()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isPublic, setIsPublic] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    isPublic,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create collection')
            }

            // Reset form and close
            setName('')
            setDescription('')
            setIsPublic(false)
            router.refresh()
            onClose()

            // Optional: Show success toast/message here if we had a toast context
        } catch (err) {
            setError(t.library.createCollectionModal.error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl p-6 text-start shadow-2xl transition-all border border-white/50">
                <div className="mb-5">
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base">
                        {t.library.createCollectionModal.title}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="collectionName" className="block text-sm font-medium text-neutral-text-primary mb-1">
                            {t.library.createCollectionModal.nameLabel}
                        </label>
                        <input
                            type="text"
                            id="collectionName"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-neutral-border-subtle bg-white focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base focus:outline-none transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="collectionDesc" className="block text-sm font-medium text-neutral-text-primary mb-1">
                            {t.library.createCollectionModal.descLabel}
                        </label>
                        <textarea
                            id="collectionDesc"
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-neutral-border-subtle bg-white focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base focus:outline-none transition-all resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="collectionPublic"
                            className="rounded border-gray-300 text-primary-base focus:ring-primary-base"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        <label htmlFor="collectionPublic" className="text-sm text-neutral-text-primary cursor-pointer select-none">
                            {t.library.createCollectionModal.visibilityLabel}
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-full text-sm font-medium text-neutral-text-secondary hover:bg-neutral-bg-soft transition-colors"
                        >
                            {t.library.createCollectionModal.cancel}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 rounded-full bg-linear-to-r from-primary-base to-secondary-base text-white text-sm font-bold shadow-button hover:shadow-floating hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? '...' : t.library.createCollectionModal.submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
