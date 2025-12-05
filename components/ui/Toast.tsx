'use client'

import { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ToastProps {
    type: 'success' | 'error'
    title: string
    message: string
    duration?: number
    onClose: () => void
}

export default function Toast({ type, title, message, duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration])

    const handleClose = () => {
        setIsLeaving(true)
        setTimeout(() => {
            setIsVisible(false)
            onClose()
        }, 300) // Match animation duration
    }

    if (!isVisible) return null

    const isSuccess = type === 'success'

    return (
        <div
            className={`
                fixed top-4 left-1/2 -translate-x-1/2 z-50
                max-w-md w-full mx-4
                rounded-xl shadow-lg border
                bg-white/95 backdrop-blur-md
                transform transition-all duration-300 ease-out
                ${isLeaving ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'}
            `}
        >
            <div
                className={`
                    p-4 rounded-xl
                    ${isSuccess
                        ? 'bg-green-50/80 border-green-200'
                        : 'bg-red-50/80 border-red-200'
                    }
                `}
            >
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                        className={`
                            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                            ${isSuccess
                                ? 'bg-green-100'
                                : 'bg-red-100'
                            }
                        `}
                    >
                        {isSuccess ? (
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        ) : (
                            <XCircleIcon className="w-6 h-6 text-red-600" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3
                            className={`
                                text-sm font-semibold mb-1
                                ${isSuccess ? 'text-green-900' : 'text-red-900'}
                            `}
                        >
                            {title}
                        </h3>
                        <p
                            className={`
                                text-sm
                                ${isSuccess ? 'text-green-700' : 'text-red-700'}
                            `}
                        >
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className={`
                            flex-shrink-0 p-1 rounded-lg transition-colors
                            ${isSuccess
                                ? 'text-green-600 hover:bg-green-100'
                                : 'text-red-600 hover:bg-red-100'
                            }
                        `}
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}




