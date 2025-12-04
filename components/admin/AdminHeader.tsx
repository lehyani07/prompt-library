'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function AdminHeader() {
    const { data: session } = useSession()
    const { t, direction, language, setLanguage } = useLanguage()
    const isRTL = direction === 'rtl'

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en')
    }

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 border-b border-gray-200" dir={direction}>
            <div className="flex items-center gap-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                    {t.admin.header.backToSite}
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {/* Language Toggle Switch */}
                <button
                    onClick={toggleLanguage}
                    className="relative inline-flex items-center w-16 h-8 rounded-full border border-neutral-border-subtle bg-neutral-bg-soft cursor-pointer transition-colors focus:outline-none"
                    aria-label="Switch Language"
                >
                    {/* AR Text - Visible on Left when Knob is Right */}
                    <span
                        className={`absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-text-secondary transition-opacity duration-300 ${
                            language === 'ar' ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        AR
                    </span>

                    {/* EN Text - Visible on Right when Knob is Left */}
                    <span
                        className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-text-secondary transition-opacity duration-300 ${
                            language === 'en' ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        EN
                    </span>

                    {/* Sliding Knob */}
                    <span
                        className={`absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-gradient-to-r from-[#2D8CFF] to-[#9B5CFF] shadow-md transition-transform duration-300 ease-in-out ${
                            language === 'ar' ? 'translate-x-8' : 'translate-x-0'
                        }`}
                    />
                </button>

                <div className={`flex flex-col ${isRTL ? 'items-start text-left' : 'items-end text-right'}`}>
                    <span className="text-sm font-medium text-gray-900">
                        {session?.user?.name || 'Admin'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {session?.user?.email}
                    </span>
                </div>
                <button
                    onClick={() => signOut()}
                    className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-red-50"
                >
                    {t.admin.header.signOut}
                </button>
            </div>
        </header>
    )
}
