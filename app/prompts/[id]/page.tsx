import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import PromptDetailsContent from "@/components/PromptDetailsContent"

export default async function PromptDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const session = await auth()

    const prompt = await prisma.prompt.findUnique({
        where: {
            id: resolvedParams.id
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            category: true,
            ratings: {
                include: {
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    favorites: true,
                    ratings: true
                }
            }
        }
    })

    if (!prompt) {
        notFound()
    }

    // Check if private and user is not the author
    if (!prompt.isPublic && (!session || session.user?.email !== prompt.author.email)) {
        redirect("/explore")
    }

    const averageRating = prompt.ratings.length > 0
        ? prompt.ratings.reduce((acc, r) => acc + r.value, 0) / prompt.ratings.length
        : 0

    return <PromptDetailsContent prompt={prompt} session={session} averageRating={averageRating} />
}
