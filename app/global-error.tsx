'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center font-sans antialiased text-slate-900">
                <div className="flex max-w-md flex-col items-center gap-6">
                    <div className="h-24 w-24 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Something went wrong!</h2>
                        <h2 className="text-2xl font-bold text-slate-600" dir="rtl">حدث خطأ ما!</h2>
                    </div>

                    <div className="text-slate-500">
                        <p>A critical error occurred. Please try refreshing the page.</p>
                        <p dir="rtl" className="mt-1">حدث خطأ حرج. يرجى محاولة تحديث الصفحة.</p>
                    </div>

                    <button
                        onClick={() => reset()}
                        className="rounded-full bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700 font-semibold"
                    >
                        Try again / حاول مرة أخرى
                    </button>
                </div>
            </body>
        </html>
    )
}
