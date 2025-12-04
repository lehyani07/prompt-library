'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function AdminHeader() {
    const { data: session } = useSession()

    return (
        <header className="bg-white shadow h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <Link href="/" className="text-gray-500 hover:text-gray-900">
                    Back to Site
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">
                    {session?.user?.name} ({session?.user?.email})
                </span>
                <button
                    onClick={() => signOut()}
                    className="text-sm text-red-600 hover:text-red-800"
                >
                    Sign Out
                </button>
            </div>
        </header>
    )
}
