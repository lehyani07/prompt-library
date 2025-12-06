'use client'

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function ForgotPassword() {
    const { t } = useLanguage()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock API call
        setTimeout(() => {
            setIsLoading(false)
            setIsSubmitted(true)
        }, 1500)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-card-soft transition-all hover:shadow-floating-badge">
                <div className="bg-linear-to-r from-primary-base to-secondary-base p-8 text-center">
                    <h2 className="text-3xl font-bold text-white">
                        {t.auth.resetPassword}
                    </h2>
                    <p className="mt-2 text-blue-50 opacity-90">
                        {t.auth.resetPasswordSubtitle}
                    </p>
                </div>

                <div className="p-8">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-text-primary">
                                    {t.auth.email}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-md border border-neutral-border-subtle bg-white px-4 py-3 text-neutral-text-primary placeholder-gray-400 transition focus:border-primary-base focus:outline-none focus:ring-2 focus:ring-primary-base/20"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full transform rounded-full bg-primary-base px-4 py-3 font-semibold text-white transition duration-200 hover:bg-primary-hover hover:shadow-button focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t.common.loading}
                                    </span>
                                ) : (
                                    t.auth.sendResetLink
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-text-primary">
                                {t.auth.checkEmail}
                            </h3>
                            <p className="text-neutral-text-secondary">
                                {t.auth.resetLinkSent} <span className="font-semibold text-neutral-text-primary">{email}</span>
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link href="/auth/signin" className="font-semibold text-primary-base hover:text-primary-hover transition-colors">
                            {t.auth.backToSignIn}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
