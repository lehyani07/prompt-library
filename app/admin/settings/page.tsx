'use client'

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function SettingsPage() {
    const { t } = useLanguage()
    const [settings, setSettings] = useState({
        siteName: "Prompt Library",
        siteDescription: "A library of AI prompts",
        allowRegistration: true,
        requireEmailVerification: true,
        moderatePrompts: false,
    })

    const handleSave = async () => {
        // TODO: Implement settings save
        alert(t.admin.settings.settingsSaved)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{t.admin.settings.title}</h1>

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
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {t.admin.settings.saveSettings}
                    </button>
                </div>
            </div>
        </div>
    )
}
