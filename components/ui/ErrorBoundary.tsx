'use client'

import { Component, ReactNode } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return <ErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false })} />
        }

        return this.props.children
    }
}

function ErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
    const { t, language } = useLanguage()

    return (
        <div className="min-h-[400px] flex items-center justify-center p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="bg-neutral-bg-card rounded-lg p-8 shadow-card max-w-md w-full text-center">
                <div className="w-16 h-16 bg-accent-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-accent-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-neutral-text-primary mb-2">
                    {t.error.title}
                </h2>

                <p className="text-neutral-text-secondary mb-6">
                    {t.error.description}
                </p>

                {error && process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 p-4 bg-accent-error/5 rounded-md text-left">
                        <p className="text-xs font-mono text-accent-error break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary-base text-neutral-text-on-primary rounded-pill font-medium hover:bg-primary-hover transition-colors"
                    >
                        {t.error.reload}
                    </button>

                    <button
                        onClick={reset}
                        className="px-6 py-2 bg-neutral-bg-soft text-neutral-text-primary rounded-pill font-medium hover:bg-neutral-border-subtle transition-colors"
                    >
                        {t.error.tryAgain}
                    </button>
                </div>
            </div>
        </div>
    )
}
