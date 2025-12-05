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
    const { t, direction } = useLanguage()
    const isRTL = direction === 'rtl'

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t.admin.logs.title}</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ width: '180px' }}>{t.admin.logs.timestamp}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center border-r border-gray-300`} style={{ width: '100px' }}>{t.admin.logs.level}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300 ${isRTL ? 'text-right' : 'text-left'}`} style={{ minWidth: '300px' }}>{t.admin.logs.message}</th>
                                <th className={`px-4 py-2.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-l border-r border-gray-300 bg-gray-100 ${isRTL ? 'text-right' : 'text-left'}`} style={{ width: '150px' }}>{t.admin.logs.user}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-center border-r border-gray-200">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                    ${log.level === 'error' ? 'bg-red-100 text-red-800' :
                                                log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {log.level.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-sm text-gray-900 border-r border-gray-200">{log.message}</td>
                                    <td className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-500 border-l border-r border-gray-200">{log.user}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}







