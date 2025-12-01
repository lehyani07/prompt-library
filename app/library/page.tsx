import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import LibraryContent from "@/components/LibraryContent"

export default async function Library() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/auth/signin")
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        include: {
            prompts: {
                include: {
                    category: true,
                    _count: {
                        select: {
                            favorites: true,
                            ratings: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            collections: {
                include: {
                    _count: {
                        select: {
                            prompts: true
                        }
                    }
                }
            },
            favorites: {
                include: {
                    prompt: {
                        include: {
                            author: {
                                select: {
                                    name: true
                                }
                            },
                            category: true
                        }
                    }
                }
            }
        }
    })

    return <LibraryContent user={user} />
}
