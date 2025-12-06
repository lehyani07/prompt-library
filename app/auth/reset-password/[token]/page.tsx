'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import toast from 'react-hot-toast'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
    const { t, language } = useLanguage()
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error(t.auth.passwordsDoNotMatch)
            return
        }

        if (password.length < 8) {
            toast.error(t.auth.passwordTooShort)
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: params.token, password }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success('Password reset successfully!')
                router.push('/auth/signin')
            } else {
                toast.error(data.error || t.common.error)
            }
        } catch (error) {
            toast.error(t.common.error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-bg-page px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="max-w-md w-full bg-neutral-bg-card rounded-lg shadow-card p-8">
                <h1 className="text-2xl font-bold text-neutral-text-primary mb-2 text-center">
                    {t.auth.setNewPassword}
                </h1>
                <p className="text-neutral-text-secondary mb-6 text-center">
                    {t.auth.setNewPasswordSubtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-text-primary mb-2">
                            {t.auth.newPassword}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full px-4 py-2 rounded-md border border-neutral-border-subtle bg-neutral-bg-card text-neutral-text-primary focus:outline-none focus:ring-2 focus:ring-primary-base"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-text-primary mb-2">
                            {t.auth.confirmPassword}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full px-4 py-2 rounded-md border border-neutral-border-subtle bg-neutral-bg-card text-neutral-text-primary focus:outline-none focus:ring-2 focus:ring-primary-base"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-6 py-3 bg-primary-base text-neutral-text-on-primary rounded-pill font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? t.common.loading : t.auth.setNewPassword}
                    </button>
                </form>
            </div>
        </div>
    )
}
