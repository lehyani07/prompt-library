'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function NotificationsPageContent() {
    const { t } = useLanguage()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{t.admin.notifications.title}</h1>

            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-500">{t.admin.notifications.noNotifications}</p>
            </div>
        </div>
    )
}











