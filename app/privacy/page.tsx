'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function PrivacyPage() {
    const { t } = useLanguage()

    return (
        <div className="min-h-screen bg-neutral-bg-page font-sans text-neutral-text-primary relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary-base/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-secondary-base/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <main className="relative mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                <div className="rounded-xl bg-white/80 backdrop-blur-md p-8 shadow-card border border-white/20">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base mb-8">
                        {t.common.privacy}
                    </h1>

                    <div className="prose prose-neutral max-w-none">
                        <p className="text-lg text-neutral-text-secondary mb-6">
                            {t.privacy.lastUpdated}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-neutral-text-primary mb-4">
                                {t.privacy.infoCollect.title}
                            </h2>
                            <p className="text-neutral-text-secondary leading-relaxed">
                                {t.privacy.infoCollect.content}
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-neutral-text-primary mb-4">
                                {t.privacy.howWeUse.title}
                            </h2>
                            <p className="text-neutral-text-secondary leading-relaxed">
                                {t.privacy.howWeUse.content}
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2 text-neutral-text-secondary">
                                {t.privacy.howWeUse.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-neutral-text-primary mb-4">
                                {t.privacy.sharing.title}
                            </h2>
                            <p className="text-neutral-text-secondary leading-relaxed">
                                {t.privacy.sharing.content}
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-neutral-text-primary mb-4">
                                {t.privacy.security.title}
                            </h2>
                            <p className="text-neutral-text-secondary leading-relaxed">
                                {t.privacy.security.content}
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
