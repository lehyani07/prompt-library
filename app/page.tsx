import { auth } from "@/auth"
import HomeContent from "@/components/HomeContent"
import { prisma } from "@/lib/prisma"

export default async function Home() {
    const session = await auth()

    // Fetch featured prompts (e.g., most rated or random)
    // For now, let's fetch the latest 5 public prompts
    const featuredPrompts = await prisma.prompt.findMany({
        where: {
            isPublic: true,
        },
        take: 5,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                }
            },
            category: true,
        }
    })

    return (
        <HomeContent
            session={session}
            featuredPrompts={featuredPrompts}
        />
    )
}
