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
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-neutral-border-subtle h-16 flex items-center justify-between px-6 shadow-sm" dir={direction}>
            <div className="flex items-center gap-4">
                <Link href="/" className="text-neutral-text-secondary hover:text-primary-base transition-colors font-medium flex items-center gap-2 group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    {t.admin.header.backToSite}
                </Link>
            </div>

            <div className="flex items-center gap-6">
                {/* Language Toggle Switch */}
                <button
                    onClick={toggleLanguage}
                    className="relative inline-flex items-center w-16 h-8 rounded-full border border-neutral-border-subtle bg-neutral-bg-soft cursor-pointer transition-colors focus:outline-none"
                    aria-label="Switch Language"
                >
                    {/* AR Text - Visible on Left when Knob is Right */}
                    <span
                        className={`absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-text-secondary transition-opacity duration-300 ${language === 'ar' ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        AR
                    </span>

                    {/* EN Text - Visible on Right when Knob is Left */}
                    <span
                        className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-text-secondary transition-opacity duration-300 ${language === 'en' ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        EN
                    </span>

                    {/* Sliding Knob */}
                    <span
                        className={`absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-linear-to-r from-primary-base to-secondary-base shadow-md transition-transform duration-300 ease-in-out ${language === 'ar' ? 'translate-x-8' : 'translate-x-0'
                            }`}
                    />
                </button>

                <div className="flex items-center gap-4 pl-6 border-l border-neutral-border-subtle rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
                    <div className={`flex flex-col ${isRTL ? 'items-start text-left' : 'items-end text-right'}`}>
                        <span className="text-sm font-bold text-neutral-text-primary">
                            {session?.user?.name || 'Admin'}
                        </span>
                        <span className="text-xs text-neutral-text-secondary">
                            {session?.user?.email}
                        </span>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                        {t.admin.header.signOut}
                    </button>
                </div>
            </div>
        </header>
    )
}
