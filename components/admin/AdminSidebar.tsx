'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
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
    ClipboardDocumentListIcon,
    EnvelopeIcon
} from "@heroicons/react/24/outline"

export default function AdminSidebar() {
    const pathname = usePathname()
    const { t, direction } = useLanguage()
    const isRTL = direction === 'rtl'
    const [unreadCount, setUnreadCount] = useState<number>(0)

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await fetch('/api/admin/contact-messages?count=true')
                if (res.ok) {
                    const data = await res.json()
                    setUnreadCount(data.unreadCount || 0)
                }
            } catch (err) {
                console.error('Failed to fetch unread count:', err)
            }
        }

        fetchUnreadCount()
        // Refresh count every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000)
        
        // Listen for custom event when messages are updated
        const handleMessagesUpdate = () => {
            fetchUnreadCount()
        }
        window.addEventListener('contactMessagesUpdated', handleMessagesUpdate)
        
        return () => {
            clearInterval(interval)
            window.removeEventListener('contactMessagesUpdated', handleMessagesUpdate)
        }
    }, [pathname])

    const navigation = [
        { name: t.admin.sidebar.dashboard, href: '/admin', icon: HomeIcon },
        { name: t.admin.sidebar.users, href: '/admin/users', icon: UsersIcon },
        { name: t.admin.sidebar.prompts, href: '/admin/prompts', icon: DocumentTextIcon },
        { name: t.admin.sidebar.categories, href: '/admin/categories', icon: TagIcon },
        { name: t.admin.sidebar.analytics, href: '/admin/analytics', icon: ChartBarIcon },
        { name: t.admin.sidebar.settings, href: '/admin/settings', icon: CogIcon },
        { name: t.admin.sidebar.contactMessages, href: '/admin/contact-messages', icon: EnvelopeIcon },
        { name: t.admin.sidebar.notifications, href: '/admin/notifications', icon: BellIcon },
        { name: t.admin.sidebar.backup, href: '/admin/backup', icon: ArchiveBoxIcon },
        { name: t.admin.sidebar.logs, href: '/admin/logs', icon: ClipboardDocumentListIcon },
    ]

    return (
        <aside
            className={`fixed top-0 w-64 h-screen bg-white/80 backdrop-blur-md text-neutral-text-primary z-10 shadow-card border-r border-white/20 ${isRTL ? 'right-0' : 'left-0'
                }`}
            dir={direction}
        >
            {/* Header */}
            <div className="p-6 border-b border-neutral-border-subtle">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-r from-primary-base to-secondary-base rounded-lg flex items-center justify-center shadow-button">
                        <span className="text-xl font-bold text-white">A</span>
                    </div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base">
                        {t.admin.sidebar.panel}
                    </h2>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    const showBadge = item.href === '/admin/contact-messages' && unreadCount > 0
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-linear-to-r from-primary-base to-secondary-base text-white shadow-button'
                                    : 'text-neutral-text-secondary hover:bg-primary-base/10 hover:text-primary-base'
                                }
                            `}
                        >
                            <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-neutral-text-secondary group-hover:text-primary-base'}`} />
                            <span className="font-medium text-sm flex-1">{item.name}</span>
                            {showBadge && (
                                <span className={`
                                    flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold
                                    ${isActive 
                                        ? 'bg-white text-primary-base' 
                                        : 'bg-red-500 text-white'
                                    }
                                `}>
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary-base via-secondary-base to-primary-base" />
        </aside>
    )
}
