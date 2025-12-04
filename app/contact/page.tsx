'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function ContactPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-neutral-bg-page font-sans text-neutral-text-primary relative overflow-hidden">
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

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                {t.auth.name}
                            </label>
                            <input
                                type="text"
                                id="name"
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
                                id="email"
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
                                rows={4}
                                className="w-full rounded-lg border border-neutral-border-subtle bg-white/50 px-4 py-2 text-sm focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                placeholder={t.contact.messagePlaceholder}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-linear-to-r from-primary-base to-secondary-base px-4 py-2.5 text-sm font-semibold text-white shadow-button hover:shadow-floating transition-all duration-300"
                        >
                            {t.contact.sendMessage}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}
