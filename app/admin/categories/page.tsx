import { prisma } from "@/lib/prisma"
import CategoriesPageContent from "@/components/admin/CategoriesPageContent"

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { prompts: true }
            }
        },
        orderBy: { name: 'asc' }
    })

    return <CategoriesPageContent categories={categories} />
}
