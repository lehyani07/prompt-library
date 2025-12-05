import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// POST - Toggle favorite
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const resolvedParams = await params
        const promptId = resolvedParams.id

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Check if already favorited
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_promptId: {
                    userId: user.id,
                    promptId: promptId
                }
            }
        })

        if (existingFavorite) {
            // Remove favorite
            await prisma.favorite.delete({
                where: { id: existingFavorite.id }
            })

            const count = await prisma.favorite.count({
                where: { promptId: promptId }
            })

            return NextResponse.json({
                isFavorited: false,
                favoriteCount: count
            })
        } else {
            // Add favorite
            await prisma.favorite.create({
                data: {
                    userId: user.id,
                    promptId: promptId
                }
            })

            const count = await prisma.favorite.count({
                where: { promptId: promptId }
            })

            return NextResponse.json({
                isFavorited: true,
                favoriteCount: count
            })
        }
    } catch (error) {
        console.error("Favorite error:", error)
        return NextResponse.json(
            { error: "Failed to toggle favorite" },
            { status: 500 }
        )
    }
}

// GET - Check if user has favorited
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const resolvedParams = await params
        const promptId = resolvedParams.id

        if (!session?.user?.email) {
            const count = await prisma.favorite.count({
                where: { promptId: promptId }
            })
            return NextResponse.json({
                isFavorited: false,
                favoriteCount: count
            })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            const count = await prisma.favorite.count({
                where: { promptId: promptId }
            })
            return NextResponse.json({
                isFavorited: false,
                favoriteCount: count
            })
        }

        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_promptId: {
                    userId: user.id,
                    promptId: promptId
                }
            }
        })

        const count = await prisma.favorite.count({
            where: { promptId: promptId }
        })

        return NextResponse.json({
            isFavorited: !!favorite,
            favoriteCount: count
        })
    } catch (error) {
        console.error("Check favorite error:", error)
        return NextResponse.json(
            { error: "Failed to check favorite" },
            { status: 500 }
        )
    }
}
