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
    initialFilteredCount: number
    initialUnreadCount: number
    initialAllCount: number
    currentPage: number
    totalPages: number
    itemsPerPage: number
    filterRead?: boolean
}

export default function ContactMessagesContent({
    initialMessages,
    initialFilteredCount,
    initialUnreadCount,
    initialAllCount,
    currentPage,
    totalPages,
    itemsPerPage,
    filterRead,
}: ContactMessagesContentProps) {
    const { t, direction } = useLanguage()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isRTL = direction === 'rtl'

    // Use state to manage local optimistic updates, but sync with props on navigation
    const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)

    // totalCount is now "Filtered Total" (e.g. total unread if filter=unread)
    const [totalCount, setTotalCount] = useState(initialFilteredCount)

    // Global stats
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount)
    const [allCount, setAllCount] = useState(initialAllCount)

    const [isLoading, setIsLoading] = useState(false)
    const [isMarkingAll, setIsMarkingAll] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<string>(
        filterRead === undefined ? "all" : filterRead ? "read" : "unread"
    )
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean
        type: 'delete' | 'markAll'
        id?: string
    }>({ isOpen: false, type: 'delete' })

    // Sync state when props change (e.g. new search params fetched new data)
    useEffect(() => {
        setMessages(initialMessages)
        setTotalCount(initialFilteredCount)
        setUnreadCount(initialUnreadCount)
        setAllCount(initialAllCount)
        setSelectedFilter(filterRead === undefined ? "all" : filterRead ? "read" : "unread")
        setIsLoading(false)
    }, [initialMessages, initialFilteredCount, initialUnreadCount, initialAllCount, filterRead])

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
                // IMPORTANT: The API response format must match our expectations
                // Assuming it returns { messages, totalCount } where totalCount is filtered count
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
        // Optimistic UI updates
        setSelectedFilter(filter)
        setIsLoading(true)

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
        // State update happens in useEffect when router completes
    }

    const handleToggleRead = async (id: string, currentRead: boolean, keepInList: boolean = false) => {
        const newReadStatus = !currentRead

        // 1. Optimistic Updates
        // Update selected message immediately if it's the one being toggled
        if (selectedMessage?.id === id) {
            setSelectedMessage(prev => prev ? { ...prev, read: newReadStatus } : null)
        }

        // Update Global Stats
        setUnreadCount(prev => currentRead ? prev + 1 : prev - 1)

        // Update List
        // If we want to keep it (e.g. modal opening), just update the status
        // Otherwise, check if it fits the current filter
        const shouldRemove = !keepInList && (
            (selectedFilter === 'unread' && newReadStatus) ||
            (selectedFilter === 'read' && !newReadStatus)
        )

        const previousMessages = [...messages]

        if (shouldRemove) {
            setMessages(prev => prev.filter(msg => msg.id !== id))
            setTotalCount(prev => prev - 1)
        } else {
            setMessages(prev => prev.map(msg =>
                msg.id === id ? { ...msg, read: newReadStatus } : msg
            ))
        }

        // 2. API Call
        try {
            const res = await fetch(`/api/admin/contact-messages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ read: newReadStatus }),
            })

            if (!res.ok) {
                throw new Error("Failed to update")
            }
        } catch (err) {
            console.error("Failed to toggle read status:", err)
            // Revert on failure
            setMessages(previousMessages)
            setUnreadCount(prev => currentRead ? prev - 1 : prev + 1)
            setTotalCount(prev => shouldRemove ? prev + 1 : prev)
            if (selectedMessage?.id === id) {
                setSelectedMessage(prev => prev ? { ...prev, read: currentRead } : null)
            }
        }
    }

    const handleMarkAllAsReadClick = () => {
        if (unreadCount === 0) return
        setConfirmModal({ isOpen: true, type: 'markAll' })
    }

    const executeMarkAllAsRead = async () => {
        setIsMarkingAll(true)
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        try {
            const res = await fetch('/api/admin/contact-messages?markAllAsRead=true', {
                method: "PATCH",
            })

            if (res.ok) {
                // Determine new visible messages based on current filter
                if (selectedFilter === "unread") {
                    setMessages([])
                    setTotalCount(0)
                } else {
                    setMessages(messages.map(msg => ({ ...msg, read: true })))
                }

                setUnreadCount(0) // All unread become 0

                window.dispatchEvent(new CustomEvent('contactMessagesUpdated'))

                if (selectedFilter === "unread") {
                    router.refresh()
                }
            }
        } catch (err) {
            console.error("Failed to mark all as read:", err)
        } finally {
            setIsMarkingAll(false)
        }
    }

    const handleDeleteClick = (id: string) => {
        setConfirmModal({ isOpen: true, type: 'delete', id })
    }

    const executeDelete = async (id: string) => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }))

        try {
            const res = await fetch(`/api/admin/contact-messages?id=${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                const wasRead = messages.find(msg => msg.id === id)?.read
                setMessages(messages.filter(msg => msg.id !== id))

                setAllCount(prev => prev - 1)
                setTotalCount(prev => prev - 1) // Remove from current list count

                if (!wasRead) {
                    setUnreadCount(prev => prev - 1)
                }

                if (selectedMessage?.id === id) {
                    setSelectedMessage(null)
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

    const handleCloseModal = () => {
        if (!selectedMessage) return

        // If we're filtering by unread/read, and the message status no longer matches the filter,
        // we should remove it from the list
        if ((selectedFilter === 'unread' && selectedMessage.read) ||
            (selectedFilter === 'read' && !selectedMessage.read)) {

            setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id))
            setTotalCount(prev => prev - 1)
        }

        setSelectedMessage(null)
    }

    const openMessage = (message: ContactMessage) => {
        // Create a local copy to track state within the modal
        setSelectedMessage(message)

        // If unread, mark as read immediately
        // Pass true to keep it in the list (don't remove while modal is open)
        if (!message.read) {
            handleToggleRead(message.id, false, true)
        }
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
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${selectedFilter === "all"
                            ? "bg-primary-base text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {t.admin.contactMessages?.all || "All"} ({allCount})
                    </button>
                    <button
                        onClick={() => handleFilterChange("unread")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${selectedFilter === "unread"
                            ? "bg-primary-base text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {t.admin.contactMessages?.unread || "Unread"} ({unreadCount})
                    </button>
                    <button
                        onClick={() => handleFilterChange("read")}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${selectedFilter === "read"
                            ? "bg-primary-base text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {t.admin.contactMessages?.read || "Read"} ({Math.max(0, allCount - unreadCount)})
                    </button>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsReadClick}
                        disabled={isMarkingAll}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-base text-white rounded-lg font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckIcon className="h-5 w-5" />
                        {isMarkingAll
                            ? (t.admin.contactMessages?.markingAll || "Marking...")
                            : (t.admin.contactMessages?.markAllAsRead || "Mark All as Read")
                        }
                    </button>
                )}
            </div>

            {/* Messages List - Email Style */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">
                        {t.common.loading}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {t.admin.contactMessages?.noMessages || "No messages found"}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                onClick={() => openMessage(message)}
                                className={`group flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${!message.read ? "bg-blue-50/40" : ""
                                    }`}
                            >
                                {/* Read Status Icon */}
                                <div className="shrink-0">
                                    {message.read ? (
                                        <EnvelopeOpenIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                                    )}
                                </div>

                                {/* Sender Info - Fixed width or flex-basis */}
                                <div className={`w-48 shrink-0 truncate ${!message.read ? "font-bold text-gray-900" : "text-gray-700"}`}>
                                    {message.name}
                                </div>

                                {/* Message Preview - Flexible */}
                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                    <span className={`truncate text-sm ${!message.read ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                                        {message.message}
                                    </span>
                                    <span className="text-gray-400 text-sm hidden sm:inline">- {new Date(message.createdAt).toLocaleDateString()}</span>
                                </div>

                                {/* Date/Time */}
                                <div className={`text-xs text-gray-500 shrink-0 whitespace-nowrap w-24 text-right ${!message.read ? "font-semibold text-blue-600" : ""}`}>
                                    {new Date(message.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>

                                {/* Actions - Hover only on desktop */}
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleToggleRead(message.id, message.read)
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                        title={message.read ? "Mark as unread" : "Mark as read"}
                                    >
                                        {message.read ? <EnvelopeIcon className="h-4 w-4" /> : <EnvelopeOpenIcon className="h-4 w-4" />}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteClick(message.id)
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                        title={t.common.delete}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700 hidden sm:block">
                            {t.common.showing || "Showing"} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} {t.common.of || "of"} {totalCount}
                        </div>
                        <div className="flex gap-1">
                            {getPageNumbers().map((pageNum, index) => (
                                <div key={index}>
                                    {pageNum === "..." ? (
                                        <span className="px-3 py-1 text-gray-500 text-sm">...</span>
                                    ) : (
                                        <a
                                            href={createPageUrl(pageNum as number)}
                                            className={`px-3 py-1 rounded text-sm transition-colors ${currentPage === pageNum
                                                ? "bg-white border border-gray-300 font-semibold shadow-sm text-primary-base"
                                                : "text-gray-600 hover:bg-gray-200"
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
            </div>

            {/* Message Details Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/20 backdrop-blur-sm"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{selectedMessage.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title={selectedMessage.read ? "Mark as unread" : "Mark as read"}
                                >
                                    {selectedMessage.read ? <EnvelopeIcon className="h-5 w-5" /> : <EnvelopeOpenIcon className="h-5 w-5" />}
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(selectedMessage.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title={t.common.delete}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                <span className="bg-gray-100 px-2 py-1 rounded">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="prose prose-blue max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <a
                                href={`mailto:${selectedMessage.email}`}
                                className="px-4 py-2 bg-primary-base text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2"
                            >
                                <EnvelopeIcon className="w-4 h-4" />
                                {t.common.reply || "Reply"}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-6 text-center">
                            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${confirmModal.type === 'delete' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                {confirmModal.type === 'delete' ? (
                                    <TrashIcon className="h-8 w-8 text-red-600" />
                                ) : (
                                    <CheckIcon className="h-8 w-8 text-blue-600" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {confirmModal.type === 'delete' ? (t.common.delete || "Delete Item") : (t.admin.contactMessages?.markAllAsRead || "Mark All as Read")}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {confirmModal.type === 'delete'
                                    ? "Are you sure you want to delete this message? This action cannot be undone."
                                    : (t.admin.contactMessages?.confirmMarkAllAsRead || "Are you sure you want to mark all messages as read?")
                                }
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    {t.common.cancel || "Cancel"}
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirmModal.type === 'delete' && confirmModal.id) {
                                            executeDelete(confirmModal.id)
                                        } else if (confirmModal.type === 'markAll') {
                                            executeMarkAllAsRead()
                                        }
                                    }}
                                    className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-sm transition-colors ${confirmModal.type === 'delete'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-primary-base hover:bg-primary-dark'
                                        }`}
                                >
                                    {confirmModal.type === 'delete' ? (t.common.delete || "Delete") : "Confirm"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
