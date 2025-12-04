import { prisma } from "@/lib/prisma"
import UsersTable from "@/components/admin/UsersTable"

export default async function UsersPage({
    searchParams
}: {
    searchParams: { role?: string; status?: string; search?: string }
}) {
    const users = await prisma.user.findMany({
        where: {
            ...(searchParams.role && { role: searchParams.role as any }),
            ...(searchParams.status && { status: searchParams.status as any }),
            ...(searchParams.search && {
                OR: [
                    { name: { contains: searchParams.search } },
                    { email: { contains: searchParams.search } }
                ]
            })
        },
        include: {
            _count: {
                select: {
                    prompts: true,
                    favorites: true,
                    ratings: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            </div>

            <UsersTable users={users} />
        </div>
    )
}
