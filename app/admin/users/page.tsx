import { prisma } from "@/lib/prisma"
import UsersPageContent from "@/components/admin/UsersPageContent"
import { Prisma } from "@prisma/client"

export default async function UsersPage({
    searchParams
}: {
    searchParams: Promise<{ role?: string; status?: string; search?: string }>
}) {
    const params = await searchParams
    const where: Prisma.UserWhereInput = {}
    
    if (params.role) {
        where.role = params.role
    }
    
    if (params.status) {
        where.status = params.status
    }
    
    if (params.search) {
        where.OR = [
            { name: { contains: params.search } },
            { email: { contains: params.search } }
        ]
    }

    const users = await prisma.user.findMany({
        where,
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

    return <UsersPageContent users={users} />
}
