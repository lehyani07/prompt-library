import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth/permissions"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import AdminPageWrapper from "@/components/AdminPageWrapper"
import AdminLayoutContent from "@/components/admin/AdminLayoutContent"

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
        <AdminPageWrapper>
            <div className="h-screen bg-neutral-bg-page flex overflow-hidden">
                <AdminSidebar />
                <AdminLayoutContent>
                    <AdminHeader />
                    <main className="flex-1 p-8 overflow-y-auto bg-neutral-bg-page">
                        {children}
                    </main>
                </AdminLayoutContent>
            </div>
        </AdminPageWrapper>
    )
}
