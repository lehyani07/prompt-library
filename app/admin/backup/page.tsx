'use client'

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useRouter } from "next/navigation"

interface Backup {
    name: string
    size: string
    date: string
    createdAt: string
}

export default function BackupPage() {
    const { t, direction } = useLanguage()
    const router = useRouter()
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [backups, setBackups] = useState<Backup[]>([])
    const [error, setError] = useState("")
    const isRTL = direction === 'rtl'

    useEffect(() => {
        fetchBackups()
    }, [])

    const fetchBackups = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/admin/backup")
            if (res.ok) {
                const data = await res.json()
                setBackups(data)
            } else {
                setError(t.common.error)
            }
        } catch (err) {
            console.error("Failed to fetch backups:", err)
            setError(t.common.error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateBackup = async () => {
        setIsCreating(true)
        setError("")
        try {
            const res = await fetch("/api/admin/backup", {
                method: "POST",
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || t.admin.backup.backupFailed)
            }

            alert(t.admin.backup.backupCreated)
            fetchBackups()
            router.refresh()
        } catch (err: any) {
            setError(err.message || t.admin.backup.backupFailed)
        } finally {
            setIsCreating(false)
        }
    }

    const handleDownload = async (fileName: string) => {
        try {
            const res = await fetch(`/api/admin/backup/${fileName}`)
            if (!res.ok) {
                throw new Error("Failed to download backup")
            }

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (err) {
            console.error("Failed to download backup:", err)
            alert(t.common.error)
        }
    }

    const handleDelete = async (fileName: string) => {
        if (!confirm("Are you sure you want to delete this backup?")) {
            return
        }

        try {
            const res = await fetch(`/api/admin/backup?file=${encodeURIComponent(fileName)}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to delete backup")
            }

            fetchBackups()
        } catch (err: any) {
            alert(err.message || t.common.error)
        }
    }

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

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        {t.common.loading}
                                    </td>
                                </tr>
                            ) : backups.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        No backups found
                                    </td>
                                </tr>
                            ) : (
                                backups.map((backup, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-2.5 text-sm font-medium text-gray-900 border-r border-gray-200">
                                            <code className="px-2 py-1 bg-gray-100 rounded text-xs">{backup.name}</code>
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap text-center text-sm text-gray-500 border-r border-gray-200">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {backup.size}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 border-l border-r border-gray-200">
                                            {new Date(backup.date).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap text-center border-l border-r border-gray-200">
                                            <button
                                                onClick={() => handleDownload(backup.name)}
                                                className="text-primary-base hover:text-primary-hover font-medium text-sm mr-4 transition-colors"
                                            >
                                                {t.admin.backup.download}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(backup.name)}
                                                className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors"
                                            >
                                                {t.admin.backup.delete}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
