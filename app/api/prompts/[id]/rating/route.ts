import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET - Get user's rating for a prompt
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const resolvedParams = await params
        const promptId = resolvedParams.id

        if (!session?.user?.email) {
            return NextResponse.json({
                hasRated: false,
                userRating: null
            })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({
                hasRated: false,
                userRating: null
            })
        }

        const rating = await prisma.rating.findUnique({
            where: {
                userId_promptId: {
                    userId: user.id,
                    promptId: promptId
                }
            }
        })

        return NextResponse.json({
            hasRated: !!rating,
            userRating: rating
        })
    } catch (error) {
        console.error("Get rating error:", error)
        return NextResponse.json(
            { error: "Failed to get rating" },
            { status: 500 }
        )
    }
}

// POST - Add or update rating
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
        const { value, comment } = await request.json()

        // Validate rating value
        if (!value || value < 1 || value > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            )
        }

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

        // Check if user is rating their own prompt
        const prompt = await prisma.prompt.findUnique({
            where: { id: promptId },
            select: { authorId: true }
        })

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt not found" },
                { status: 404 }
            )
        }

        if (prompt.authorId === user.id) {
            return NextResponse.json(
                { error: "You cannot rate your own prompt" },
                { status: 403 }
            )
        }

        // Create or update rating
        const rating = await prisma.rating.upsert({
            where: {
                userId_promptId: {
                    userId: user.id,
                    promptId: promptId
                }
            },
            update: {
                value,
                comment: comment || null
            },
            create: {
                value,
                comment: comment || null,
                userId: user.id,
                promptId: promptId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        // Get updated average rating
        const ratings = await prisma.rating.findMany({
            where: { promptId: promptId },
            select: { value: true }
        })

        const averageRating = ratings.length > 0
            ? ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length
            : 0

        return NextResponse.json({
            rating,
            averageRating,
            totalRatings: ratings.length
        })
    } catch (error) {
        console.error("Rating error:", error)
        return NextResponse.json(
            { error: "Failed to submit rating" },
            { status: 500 }
        )
    }
}

// DELETE - Remove rating
export async function DELETE(
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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        await prisma.rating.delete({
            where: {
                userId_promptId: {
                    userId: user.id,
                    promptId: promptId
                }
            }
        })

        // Get updated average rating
        const ratings = await prisma.rating.findMany({
            where: { promptId: promptId },
            select: { value: true }
        })

        const averageRating = ratings.length > 0
            ? ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length
            : 0

        return NextResponse.json({
            averageRating,
            totalRatings: ratings.length
        })
    } catch (error) {
        console.error("Delete rating error:", error)
        return NextResponse.json(
            { error: "Failed to delete rating" },
            { status: 500 }
        )
    }
}
