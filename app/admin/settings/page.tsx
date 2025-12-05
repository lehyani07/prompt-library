'use client'

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const { t } = useLanguage()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState("")
    const [settings, setSettings] = useState({
        siteName: "Prompt Library",
        siteDescription: "A library of AI prompts",
        allowRegistration: true,
        requireEmailVerification: false,
        moderatePrompts: false,
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings")
                if (res.ok) {
                    const data = await res.json()
                    setSettings({
                        siteName: data.siteName || "Prompt Library",
                        siteDescription: data.siteDescription || "A library of AI prompts",
                        allowRegistration: data.allowRegistration !== undefined ? data.allowRegistration : true,
                        requireEmailVerification: data.requireEmailVerification !== undefined ? data.requireEmailVerification : false,
                        moderatePrompts: data.moderatePrompts !== undefined ? data.moderatePrompts : false,
                    })
                }
            } catch (err) {
                console.error("Failed to load settings:", err)
                setError(t.common.error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSettings()
    }, [t.common.error])

    const handleSave = async () => {
        setIsSaving(true)
        setError("")

        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || t.common.error)
            }

            alert(t.admin.settings.settingsSaved)
            router.refresh()
        } catch (err: any) {
            setError(err.message || t.common.error)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">{t.admin.settings.title}</h1>
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-gray-500">{t.common.loading}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{t.admin.settings.title}</h1>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.admin.settings.siteName}
                    </label>
                    <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.admin.settings.siteDescription}
                    </label>
                    <textarea
                        value={settings.siteDescription}
                        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.allowRegistration}
                            onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            {t.admin.settings.allowRegistration}
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.requireEmailVerification}
                            onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            {t.admin.settings.requireEmailVerification}
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={settings.moderatePrompts}
                            onChange={(e) => setSettings({ ...settings, moderatePrompts: e.target.checked })}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            {t.admin.settings.moderatePrompts}
                        </label>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? t.common.loading : t.admin.settings.saveSettings}
                    </button>
                </div>
            </div>
        </div>
    )
}
