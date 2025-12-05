'use client'

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function BackupPage() {
    const { t, direction } = useLanguage()
    const [isCreating, setIsCreating] = useState(false)
    const isRTL = direction === 'rtl'

    const handleCreateBackup = async () => {
        setIsCreating(true)
        try {
            // TODO: Implement actual backup creation
            await new Promise(resolve => setTimeout(resolve, 2000))
            alert(t.admin.backup.backupCreated)
        } catch (error) {
            alert(t.admin.backup.backupFailed)
        } finally {
            setIsCreating(false)
        }
    }

    // Mock backup history
    const backups = [
        { id: 1, name: 'backup_20231201_120000.zip', size: '2.5 MB', date: '2023-12-01 12:00:00' },
        { id: 2, name: 'backup_20231130_120000.zip', size: '2.4 MB', date: '2023-11-30 12:00:00' },
        { id: 3, name: 'backup_20231129_120000.zip', size: '2.3 MB', date: '2023-11-29 12:00:00' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{t.admin.backup.title}</h1>
                <button
                    onClick={handleCreateBackup}
                    disabled={isCreating}
                    className="px-4 py-2 bg-linear-to-r from-primary-base to-secondary-base text-white rounded-lg font-semibold hover:shadow-button transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCreating ? t.admin.backup.creating : t.admin.backup.createBackup}
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ minWidth: '300px' }}>{t.admin.backup.filename}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-r border-gray-300`} style={{ width: '120px' }}>{t.admin.backup.size}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-l border-r border-gray-300 bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`} style={{ width: '180px' }}>{t.admin.backup.created}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-l border-r border-gray-300`} style={{ width: '150px' }}>{t.admin.backup.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {backups.map((backup) => (
                                <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2.5 text-sm font-medium text-gray-900 border-r border-gray-200">
                                        <code className="px-2 py-1 bg-gray-100 rounded text-xs">{backup.name}</code>
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-center text-sm text-gray-500 border-r border-gray-200">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {backup.size}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 border-l border-r border-gray-200">
                                        {backup.date}
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-center border-l border-r border-gray-200">
                                        <button className="text-primary-base hover:text-primary-hover font-medium text-sm mr-4 transition-colors">
                                            {t.admin.backup.download}
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors">
                                            {t.admin.backup.delete}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
