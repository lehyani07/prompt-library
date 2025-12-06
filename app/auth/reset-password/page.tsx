'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function ResetPassword() {
    const { t } = useLanguage()
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError(t.auth.passwordsDoNotMatch)
            return
        }

        if (password.length < 8) {
            setError(t.auth.passwordTooShort)
            return
        }

        setIsLoading(true)

        // Mock API call
        setTimeout(() => {
            setIsLoading(false)
            router.push("/auth/signin")
        }, 1500)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-card-soft transition-all hover:shadow-floating-badge">
                <div className="bg-linear-to-r from-primary-base to-secondary-base p-8 text-center">
                    <h2 className="text-3xl font-bold text-white">
                        {t.auth.setNewPassword}
                    </h2>
                    <p className="mt-2 text-blue-50 opacity-90">
                        {t.auth.setNewPasswordSubtitle}
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-sm text-accent-error border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-text-primary">
                                    {t.auth.newPassword}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md border border-neutral-border-subtle bg-white px-4 py-3 text-neutral-text-primary placeholder-gray-400 transition focus:border-primary-base focus:outline-none focus:ring-2 focus:ring-primary-base/20"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-neutral-text-primary">
                                    {t.auth.confirmPassword}
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-md border border-neutral-border-subtle bg-white px-4 py-3 text-neutral-text-primary placeholder-gray-400 transition focus:border-primary-base focus:outline-none focus:ring-2 focus:ring-primary-base/20"
                                />
                            </div>
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
                                    {t.auth.resetPassword}
                                </span>
                            ) : (
                                t.auth.resetPassword
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <Link href="/auth/signin" className="font-semibold text-primary-base hover:text-primary-hover transition-colors">
                                {t.auth.backToSignIn}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
