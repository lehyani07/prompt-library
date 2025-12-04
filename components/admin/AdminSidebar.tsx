'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import {
    HomeIcon,
    UsersIcon,
    DocumentTextIcon,
    TagIcon,
    ChartBarIcon,
    CogIcon,
    BellIcon,
    ArchiveBoxIcon,
    ClipboardDocumentListIcon
} from "@heroicons/react/24/outline"

export default function AdminSidebar() {
    const pathname = usePathname()
    const { t, direction } = useLanguage()
    const isRTL = direction === 'rtl'

    const navigation = [
        { name: t.admin.sidebar.dashboard, href: '/admin', icon: HomeIcon },
        { name: t.admin.sidebar.users, href: '/admin/users', icon: UsersIcon },
        { name: t.admin.sidebar.prompts, href: '/admin/prompts', icon: DocumentTextIcon },
        { name: t.admin.sidebar.categories, href: '/admin/categories', icon: TagIcon },
        { name: t.admin.sidebar.analytics, href: '/admin/analytics', icon: ChartBarIcon },
        { name: t.admin.sidebar.settings, href: '/admin/settings', icon: CogIcon },
        { name: t.admin.sidebar.notifications, href: '/admin/notifications', icon: BellIcon },
        { name: t.admin.sidebar.backup, href: '/admin/backup', icon: ArchiveBoxIcon },
        { name: t.admin.sidebar.logs, href: '/admin/logs', icon: ClipboardDocumentListIcon },
    ]

    return (
        <aside 
            className={`fixed top-0 w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white z-10 shadow-2xl ${
                isRTL ? 'right-0' : 'left-0'
            }`}
            dir={direction}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold">A</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{t.admin.sidebar.panel}</h2>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50'
                                    : 'text-gray-300 hover:bg-gray-800/70 hover:text-white'
                                }
                                ${!isActive && !isRTL ? 'hover:translate-x-1' : ''}
                                ${!isActive && isRTL ? 'hover:translate-x-[-4px]' : ''}
                            `}
                        >
                            <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            <span className="font-medium text-sm flex-1">{item.name}</span>
                            {isActive && (
                                <div className={`w-1.5 h-1.5 rounded-full bg-white ${isRTL ? 'mr-auto' : 'ml-auto'}`} />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
        </aside>
    )
}
