'use client'

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import Toast from "@/components/ui/Toast"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

interface ToastData {
    type: 'success' | 'error'
    title: string
    message: string
}

export default function UserSettings() {
    const { t } = useLanguage()
    const router = useRouter()
    const [toast, setToast] = useState<ToastData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Profile State
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [isProfileLoading, setIsProfileLoading] = useState(false)

    // Password State
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [isPasswordLoading, setIsPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState("")

    // Delete Account State
    const [isDeleting, setIsDeleting] = useState(false)

    // Fetch user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user")
                if (res.ok) {
                    const data = await res.json()
                    setName(data.name || "")
                    setEmail(data.email || "")
                } else if (res.status === 401) {
                    // Not authenticated, redirect to login
                    router.push("/auth/login")
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error)
                setToast({
                    type: 'error',
                    title: t.common.error || "Error",
                    message: t.userSettings.loadError || "Failed to load profile"
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [router, t])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProfileLoading(true)

        try {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            })

            const data = await res.json()

            if (res.ok) {
                setToast({
                    type: 'success',
                    title: t.common.save,
                    message: t.userSettings.profileUpdated
                })
            } else {
                setToast({
                    type: 'error',
                    title: t.common.error || "Error",
                    message: data.error || t.userSettings.updateError || "Failed to update profile"
                })
            }
        } catch (error) {
            console.error("Update profile error:", error)
            setToast({
                type: 'error',
                title: t.common.error || "Error",
                message: t.userSettings.updateError || "Failed to update profile"
            })
        } finally {
            setIsProfileLoading(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError("")

        if (newPassword !== confirmNewPassword) {
            setPasswordError(t.auth.passwordsDoNotMatch)
            return
        }

        if (newPassword.length < 8) {
            setPasswordError(t.auth.passwordTooShort || "Password must be at least 8 characters")
            return
        }

        setIsPasswordLoading(true)

        try {
            const res = await fetch("/api/user/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setCurrentPassword("")
                setNewPassword("")
                setConfirmNewPassword("")
                setToast({
                    type: 'success',
                    title: t.common.save,
                    message: t.userSettings.passwordUpdated
                })
            } else {
                setPasswordError(data.error || t.userSettings.passwordUpdateError || "Failed to change password")
            }
        } catch (error) {
            console.error("Change password error:", error)
            setPasswordError(t.userSettings.passwordUpdateError || "Failed to change password")
        } finally {
            setIsPasswordLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!confirm(t.userSettings.deleteConfirm)) return

        setIsDeleting(true)

        try {
            const res = await fetch("/api/user/delete", {
                method: "DELETE",
            })

            if (res.ok) {
                // Sign out and redirect to home
                await signOut({ redirect: false })
                router.push("/")
            } else {
                const data = await res.json()
                setToast({
                    type: 'error',
                    title: t.common.error || "Error",
                    message: data.error || t.userSettings.deleteError || "Failed to delete account"
                })
                setIsDeleting(false)
            }
        } catch (error) {
            console.error("Delete account error:", error)
            setToast({
                type: 'error',
                title: t.common.error || "Error",
                message: t.userSettings.deleteError || "Failed to delete account"
            })
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-bg-page flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-base"></div>
            </div>
        )
    }

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

            <main className="relative mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base mb-8">
                    {t.userSettings.title}
                </h1>

                <div className="space-y-8">
                    {/* Profile Settings */}
                    <div className="rounded-xl bg-white p-6 shadow-card border border-neutral-border-subtle">
                        <h2 className="text-xl font-semibold text-neutral-text-primary mb-6 pb-4 border-b border-neutral-border-subtle">
                            {t.userSettings.profile}
                        </h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                    {t.auth.email}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    disabled
                                    className="w-full rounded-lg border border-neutral-border-subtle bg-gray-50 px-4 py-2.5 text-neutral-text-secondary cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                    {t.auth.name}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-border-subtle bg-white px-4 py-2.5 text-neutral-text-primary focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isProfileLoading}
                                    className="rounded-full bg-primary-base px-6 py-2 text-sm font-semibold text-white shadow-button hover:bg-primary-hover hover:shadow-floating transition-all duration-200 disabled:opacity-70"
                                >
                                    {isProfileLoading ? t.common.loading : t.userSettings.updateProfile}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security Settings */}
                    <div className="rounded-xl bg-white p-6 shadow-card border border-neutral-border-subtle">
                        <h2 className="text-xl font-semibold text-neutral-text-primary mb-6 pb-4 border-b border-neutral-border-subtle">
                            {t.userSettings.security}
                        </h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            {passwordError && (
                                <div className="rounded-md bg-red-50 p-3 text-sm text-accent-error border border-red-100">
                                    {passwordError}
                                </div>
                            )}
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                    {t.userSettings.currentPassword}
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-border-subtle bg-white px-4 py-2.5 text-neutral-text-primary focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                        {t.userSettings.newPassword}
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full rounded-lg border border-neutral-border-subtle bg-white px-4 py-2.5 text-neutral-text-primary focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-neutral-text-secondary mb-2">
                                        {t.userSettings.confirmNewPassword}
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmNewPassword"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="w-full rounded-lg border border-neutral-border-subtle bg-white px-4 py-2.5 text-neutral-text-primary focus:border-primary-base focus:ring-1 focus:ring-primary-base outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isPasswordLoading}
                                    className="rounded-full bg-primary-base px-6 py-2 text-sm font-semibold text-white shadow-button hover:bg-primary-hover hover:shadow-floating transition-all duration-200 disabled:opacity-70"
                                >
                                    {isPasswordLoading ? t.common.loading : t.userSettings.changePassword}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="rounded-xl bg-red-50/50 p-6 shadow-sm border border-red-100">
                        <h2 className="text-xl font-semibold text-accent-error mb-4">
                            {t.userSettings.dangerZone}
                        </h2>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <p className="text-neutral-text-secondary text-sm">
                                {t.userSettings.deleteAccountDesc}
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="shrink-0 rounded-full border border-accent-error text-accent-error px-6 py-2 text-sm font-semibold hover:bg-accent-error hover:text-white transition-all duration-200 disabled:opacity-70"
                            >
                                {isDeleting ? t.common.loading : t.userSettings.deleteAccount}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
