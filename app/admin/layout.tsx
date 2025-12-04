import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth/permissions"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    try {
        await requireAdmin()
    } catch {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
