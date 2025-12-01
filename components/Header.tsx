'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

interface HeaderProps {
    user?: any
}

export default function Header({ user }: HeaderProps) {
    const { t, language, setLanguage } = useLanguage()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en')
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-border-subtle shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-base to-secondary-base flex items-center justify-center text-white font-bold text-xl">
                                P
                            </div>
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base hidden sm:block">
                                Prompt Library
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-neutral-text-secondary hover:text-primary-base font-medium transition-colors"
                        >
                            {t.common.home}
                        </Link>
                        <Link
                            href="/explore"
                            className="text-neutral-text-secondary hover:text-primary-base font-medium transition-colors"
                        >
                            {t.common.explore || 'Explore'}
                        </Link>
                        {user && (
                            <Link
                                href="/library"
                                className="text-neutral-text-secondary hover:text-primary-base font-medium transition-colors"
                            >
                                {t.common.library || 'Library'}
                            </Link>
                        )}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Language Switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 text-neutral-text-secondary hover:text-primary-base transition-colors rounded-lg hover:bg-neutral-bg-soft"
                            aria-label="Switch Language"
                        >
                            {language === 'en' ? '🇺🇸 English' : '🇸🇦 العربية'}
                        </button>

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-neutral-text-primary">
                                    {user.name || user.email}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 text-sm font-semibold text-primary-base border border-primary-base rounded-lg hover:bg-primary-base hover:text-white transition-all duration-200"
                                >
                                    {t.common.signOut}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/signin"
                                    className="px-4 py-2 text-sm font-semibold text-neutral-text-secondary hover:text-primary-base transition-colors"
                                >
                                    {t.common.signIn}
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 text-sm font-bold text-white bg-primary-base rounded-full hover:bg-primary-hover shadow-button hover:shadow-floating transition-all duration-200"
                                >
                                    {t.common.signUp}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-neutral-text-secondary hover:text-primary-base hover:bg-neutral-bg-soft focus:outline-none"
                        >
                            <span className="sr-only">Open menu</span>
                            {/* Hamburger Icon */}
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-neutral-border-subtle">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            href="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-text-secondary hover:text-primary-base hover:bg-neutral-bg-soft"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t.common.home}
                        </Link>
                        <Link
                            href="/explore"
                            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-text-secondary hover:text-primary-base hover:bg-neutral-bg-soft"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t.common.explore || 'Explore'}
                        </Link>
                        {user && (
                            <Link
                                href="/library"
                                className="block px-3 py-2 rounded-md text-base font-medium text-neutral-text-secondary hover:text-primary-base hover:bg-neutral-bg-soft"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t.common.library || 'Library'}
                            </Link>
                        )}

                        <div className="border-t border-neutral-border-subtle my-2 pt-2">
                            <button
                                onClick={() => {
                                    toggleLanguage()
                                    setIsMenuOpen(false)
                                }}
                                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-neutral-text-secondary hover:text-primary-base hover:bg-neutral-bg-soft"
                            >
                                {language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                            </button>

                            {user ? (
                                <button
                                    onClick={() => signOut()}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
                                >
                                    {t.common.signOut}
                                </button>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/signin"
                                        className="block px-3 py-2 rounded-md text-base font-medium text-neutral-text-secondary hover:text-primary-base hover:bg-neutral-bg-soft"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t.common.signIn}
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="block px-3 py-2 rounded-md text-base font-bold text-primary-base hover:bg-neutral-bg-soft"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {t.common.signUp}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
