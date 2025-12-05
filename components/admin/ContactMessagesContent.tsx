'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { EnvelopeIcon, EnvelopeOpenIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline"

interface ContactMessage {
    id: string
    name: string
    email: string
    message: string
    read: boolean
    createdAt: string
}

interface ContactMessagesContentProps {
    initialMessages: ContactMessage[]
    initialTotalCount: number
    initialUnreadCount: number
    currentPage: number
    totalPages: number
    itemsPerPage: number
    filterRead?: boolean
}

export default function ContactMessagesContent({
    initialMessages,
    initialTotalCount,
    initialUnreadCount,
    currentPage,
    totalPages,
    itemsPerPage,
    filterRead,
}: ContactMessagesContentProps) {
    const { t, direction } = useLanguage()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isRTL = direction === 'rtl'

    const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
    const [totalCount, setTotalCount] = useState(initialTotalCount)
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount)
    const [isLoading, setIsLoading] = useState(false)
    const [isMarkingAll, setIsMarkingAll] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<string>(
        filterRead === undefined ? "all" : filterRead ? "read" : "unread"
    )

    const fetchMessages = async (page: number = 1, readFilter?: boolean) => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (readFilter !== undefined) {
                params.set("read", readFilter.toString())
            }
            if (page > 1) {
                params.set("page", page.toString())
            }

            const res = await fetch(`/api/admin/contact-messages?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data.messages)
                setTotalCount(data.totalCount)
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFilterChange = (filter: string) => {
        setSelectedFilter(filter)
        const params = new URLSearchParams(searchParams.toString())
        
        if (filter === "all") {
            params.delete("read")
        } else if (filter === "read") {
            params.set("read", "true")
        } else if (filter === "unread") {
            params.set("read", "false")
        }
        
        params.delete("page")
        router.push(`/admin/contact-messages?${params.toString()}`)
    }

    const handleToggleRead = async (id: string, currentRead: boolean) => {
        try {
            const res = await fetch(`/api/admin/contact-messages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ read: !currentRead }),
            })

            if (res.ok) {
                setMessages(messages.map(msg => 
                    msg.id === id ? { ...msg, read: !currentRead } : msg
                ))
                setUnreadCount(currentRead ? unreadCount + 1 : unreadCount - 1)
            }
        } catch (err) {
            console.error("Failed to toggle read status:", err)
        }
    }

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return
        
        if (!confirm(t.admin.contactMessages?.confirmMarkAllAsRead || "Are you sure you want to mark all messages as read?")) {
            return
        }

        setIsMarkingAll(true)
        try {
            const res = await fetch('/api/admin/contact-messages?markAllAsRead=true', {
                method: "PATCH",
            })

            if (res.ok) {
                // Update all messages to read
                setMessages(messages.map(msg => ({ ...msg, read: true })))
                setUnreadCount(0)
                // Dispatch event to update sidebar count
                window.dispatchEvent(new CustomEvent('contactMessagesUpdated'))
                // Refresh messages if we're on a filtered view
                if (selectedFilter === "unread") {
                    router.push('/admin/contact-messages?read=true')
                } else {
                    fetchMessages(currentPage, filterRead)
                }
            }
        } catch (err) {
            console.error("Failed to mark all as read:", err)
        } finally {
            setIsMarkingAll(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) {
            return
        }

        try {
            const res = await fetch(`/api/admin/contact-messages?id=${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                setMessages(messages.filter(msg => msg.id !== id))
                setTotalCount(totalCount - 1)
                if (!messages.find(msg => msg.id === id)?.read) {
                    setUnreadCount(unreadCount - 1)
                }
            }
        } catch (err) {
            console.error("Failed to delete message:", err)
        }
    }

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page === 1) {
            params.delete("page")
        } else {
            params.set("page", page.toString())
        }
        return `/admin/contact-messages?${params.toString()}`
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxPages = 5

        if (totalPages <= maxPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push("...")
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1)
                pages.push("...")
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push("...")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i)
                }
                pages.push("...")
                pages.push(totalPages)
            }
        }

        return pages
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    {t.admin.contactMessages?.title || "Contact Messages"}
                </h1>
                {unreadCount > 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        {unreadCount} {t.admin.contactMessages?.unread || "unread"}
                    </span>
                )}
            </div>

            {/* Filters and Actions */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => handleFilterChange("all")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            selectedFilter === "all"
                                ? "bg-primary-base text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {t.admin.contactMessages?.all || "All"} ({totalCount})
                    </button>
                    <button
                        onClick={() => handleFilterChange("unread")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            selectedFilter === "unread"
                                ? "bg-primary-base text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {t.admin.contactMessages?.unread || "Unread"} ({unreadCount})
                    </button>
                    <button
                        onClick={() => handleFilterChange("read")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            selectedFilter === "read"
                                ? "bg-primary-base text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {t.admin.contactMessages?.read || "Read"} ({totalCount - unreadCount})
                    </button>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={isMarkingAll}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckIcon className="h-5 w-5" />
                        {isMarkingAll 
                            ? (t.admin.contactMessages?.markingAll || "Marking...")
                            : (t.admin.contactMessages?.markAllAsRead || "Mark All as Read")
                        }
                    </button>
                )}
            </div>

            {/* Messages List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">
                        {t.common.loading}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {t.admin.contactMessages?.noMessages || "No messages found"}
                    </div>
                ) : (
                    <>
                        <div className="divide-y divide-gray-200">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-6 hover:bg-gray-50 transition-colors ${
                                        !message.read ? "bg-blue-50/50" : ""
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {message.read ? (
                                                    <EnvelopeOpenIcon className="h-5 w-5 text-gray-400" />
                                                ) : (
                                                    <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                                                )}
                                                <h3 className="font-semibold text-gray-900">
                                                    {message.name}
                                                </h3>
                                                {!message.read && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        {t.admin.contactMessages?.new || "New"}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {message.email}
                                            </p>
                                            <p className="text-gray-700 whitespace-pre-wrap">
                                                {message.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-3">
                                                {new Date(message.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleToggleRead(message.id, message.read)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    message.read
                                                        ? "text-gray-400 hover:bg-gray-100"
                                                        : "text-blue-600 hover:bg-blue-50"
                                                }`}
                                                title={message.read ? "Mark as unread" : "Mark as read"}
                                            >
                                                {message.read ? (
                                                    <EnvelopeOpenIcon className="h-5 w-5" />
                                                ) : (
                                                    <EnvelopeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(message.id)}
                                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                title={t.common.delete}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    {t.admin.prompts?.showing || "Showing"} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} {t.admin.prompts?.of || "of"} {totalCount}
                                </div>
                                <div className="flex gap-2">
                                    {getPageNumbers().map((pageNum, index) => (
                                        <div key={index}>
                                            {pageNum === "..." ? (
                                                <span className="px-3 py-2 text-gray-500">...</span>
                                            ) : (
                                                <a
                                                    href={createPageUrl(pageNum as number)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                        currentPage === pageNum
                                                            ? "bg-primary-base text-white"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

