'use client'

import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { direction } = useLanguage()
    const isRTL = direction === 'rtl'

    return (
        <div 
            className={`flex flex-col h-screen flex-1 ${isRTL ? 'mr-64' : 'ml-64'}`}
            dir={direction}
        >
            <div className="flex-1 flex flex-col min-h-0">
                <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
                    {children}
                </div>
            </div>
        </div>
    )
}

