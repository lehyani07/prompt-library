'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
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

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Prompts', href: '/admin/prompts', icon: DocumentTextIcon },
    { name: 'Categories', href: '/admin/categories', icon: TagIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
    { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
    { name: 'Backup', href: '/admin/backup', icon: ArchiveBoxIcon },
    { name: 'Logs', href: '/admin/logs', icon: ClipboardDocumentListIcon },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen">
            <div className="p-6">
                <h2 className="text-xl font-bold">Admin Panel</h2>
            </div>

            <nav className="space-y-1 px-3">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }
              `}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
