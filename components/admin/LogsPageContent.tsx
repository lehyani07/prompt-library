'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Log {
    id: number
    timestamp: string
    level: string
    message: string
    user: string
}

export default function LogsPageContent({ logs }: { logs: Log[] }) {
    const { t } = useLanguage()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{t.admin.logs.title}</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.logs.timestamp}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.logs.level}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.logs.message}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.admin.logs.user}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${log.level === 'error' ? 'bg-red-100 text-red-800' :
                                            log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'}`}>
                                        {log.level.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{log.message}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.user}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}



