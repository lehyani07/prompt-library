'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

interface HeaderProps {
    user?: any
}

export default function Header({ user }: HeaderProps) {
    const { t, language, setLanguage } = useLanguage()
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery)}`)
            setSearchQuery('')
            setIsMenuOpen(false)
        }
    }

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en')
    }

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-border-subtle shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="shrink-0 flex items-center">
                        <Link href="/" className="flex items-center">
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base">
                                Prompt Library
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-primary-base hover:text-primary-hover font-semibold transition-colors"
                        >
                            {t.common.home}
                        </Link>
                        <Link
                            href="/explore"
                            className="text-primary-base hover:text-primary-hover font-semibold transition-colors"
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

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-sm mx-8">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <input
                                type="text"
                                placeholder={t.common.search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-border-subtle bg-neutral-bg-soft focus:outline-none focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base transition-all text-sm"
                            />
                            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text-secondary hover:text-primary-base">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-neutral-text-primary">
                                    {user.name || user.email}
                                </span>
                                <Link
                                    href="/settings"
                                    className="p-2 text-neutral-text-secondary hover:text-primary-base transition-colors"
                                    title={t.userSettings.title}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </Link>
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
            {
                isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-neutral-border-subtle">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <form onSubmit={handleSearch} className="mb-4 px-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t.common.search}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-border-subtle bg-neutral-bg-soft focus:outline-none focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base transition-all text-sm"
                                    />
                                    <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text-secondary hover:text-primary-base">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
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
                                    <>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
                                        >
                                            {t.common.signOut}
                                        </button>
                                        <Link
                                            href="/settings"
                                            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-text-secondary hover:text-primary-base hover:bg-neutral-bg-soft"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {t.userSettings.title}
                                        </Link>
                                    </>
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
                )
            }
        </header>
    )
}
