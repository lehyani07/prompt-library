'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { dictionaries, Locale, Direction } from './dictionaries'

interface LanguageContextType {
    language: Locale
    direction: Direction
    setLanguage: (lang: Locale) => void
    t: typeof dictionaries['en']
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Locale>('en')
    const [direction, setDirection] = useState<Direction>('ltr')

    useEffect(() => {
        // Load saved language from localStorage
        const savedLang = localStorage.getItem('language') as Locale
        if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
            setLanguageState(savedLang)
            setDirection(savedLang === 'ar' ? 'rtl' : 'ltr')
        }
    }, [])

    const setLanguage = (lang: Locale) => {
        setLanguageState(lang)
        const dir = lang === 'ar' ? 'rtl' : 'ltr'
        setDirection(dir)
        localStorage.setItem('language', lang)

        // Update HTML dir attribute
        document.documentElement.dir = dir
        document.documentElement.lang = lang
    }

    const value = {
        language,
        direction,
        setLanguage,
        t: dictionaries[language]
    }

    return (
        <LanguageContext.Provider value={value}>
            <div dir={direction} className={language === 'ar' ? 'font-sans-arabic' : 'font-sans'}>
                {children}
            </div>
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
