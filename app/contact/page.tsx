'use client'

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import Toast from "@/components/ui/Toast"

interface ToastData {
    type: 'success' | 'error'
    title: string
    message: string
}

export default function ContactPage() {
    const { t } = useLanguage()
    const [toast, setToast] = useState<ToastData | null>(null)

    return (
        <div className="min-h-screen bg-neutral-bg-page font-sans text-neutral-text-primary relative overflow-hidden">
            {/* Toast Notification */}
            {toast && (
                <Toast
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary-base/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary-base/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <main className="relative mx-auto max-w-2xl px-4 py-8 md:px-8 md:py-12">
                <div className="rounded-xl bg-white/80 backdrop-blur-md p-8 shadow-card border border-white/20">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base mb-4 text-center">
                        {t.common.contact}
                    </h1>
                    <p className="text-center text-neutral-text-secondary mb-8">
                        {t.contact.subtitle}
                    </p>

                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        const form = e.target as HTMLFormElement
                        const formData = new FormData(form)
                        const data = {
                            name: formData.get('name'),
                            email: formData.get('email'),
                            message: formData.get('message'),
                            website: formData.get('website') // Honeypot field
                        }

                        const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement
                        const originalText = submitBtn.innerText
                        submitBtn.disabled = true
                        submitBtn.innerText = t.common.loading

                        try {
                            const res = await fetch('/api/contact', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data)
                            })

                            if (res.ok) {
                                setToast({
                                    type: 'success',
                                    title: t.contact.successTitle,
                                    message: t.contact.successMessage
                                })
                                form.reset()
                            } else {
                                const data = await res.json().catch(() => ({}))
                                setToast({
                                    type: 'error',
                                    title: t.contact.errorTitle,
                                    message: data.error || t.contact.errorMessage
                                })
                            }
                        } catch (err) {
                            console.error(err)
                            setToast({
                                type: 'error',
                                title: t.contact.errorTitle,
                                message: t.contact.errorMessage
                            })
                        } finally {
                            submitBtn.disabled = false
                            submitBtn.innerText = originalText
                        }
                    }} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                {t.auth.name}
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="w-full rounded-lg border border-neutral-border-subtle bg-white/50 px-4 py-2 text-sm focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                placeholder={t.contact.namePlaceholder}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                {t.auth.email}
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="w-full rounded-lg border border-neutral-border-subtle bg-white/50 px-4 py-2 text-sm focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                placeholder={t.contact.emailPlaceholder}
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                {t.contact.message}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                required
                                className="w-full rounded-lg border border-neutral-border-subtle bg-white/50 px-4 py-2 text-sm focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                placeholder={t.contact.messagePlaceholder}
                            ></textarea>
                        </div>

                        {/* Honeypot field - hidden from real users */}
                        <div className="hidden" aria-hidden="true">
                            <label htmlFor="website">Website</label>
                            <input
                                type="text"
                                name="website"
                                id="website"
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-linear-to-r from-primary-base to-secondary-base px-4 py-2.5 text-sm font-semibold text-white shadow-button hover:shadow-floating transition-all duration-300 disabled:opacity-70"
                        >
                            {t.contact.sendMessage}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
