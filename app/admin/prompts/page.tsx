import { prisma } from "@/lib/prisma"
import PromptsTable from "@/components/admin/PromptsTable"

export default async function PromptsPage({
    searchParams
}: {
    searchParams: { category?: string; status?: string; search?: string }
}) {
    const prompts = await prisma.prompt.findMany({
        where: {
            ...(searchParams.category && { categoryId: searchParams.category }),
            ...(searchParams.search && {
                OR: [
                    { title: { contains: searchParams.search } },
                    { content: { contains: searchParams.search } }
                ]
            })
        },
        include: {
            author: {
                select: { name: true, email: true }
            },
            category: true,
            _count: {
                select: {
                    favorites: true,
                    ratings: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Prompts Management</h1>

            <PromptsTable prompts={prompts} />
        </div>
    )
}
