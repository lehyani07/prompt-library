import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// DELETE user account
export async function DELETE() {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Delete user and all related data (cascading)
        // First delete related records that don't cascade automatically
        await prisma.$transaction([
            // Delete user's ratings
            prisma.rating.deleteMany({
                where: { userId: user.id }
            }),
            // Delete user's favorites
            prisma.favorite.deleteMany({
                where: { userId: user.id }
            }),
            // Delete collection prompts for user's collections
            prisma.collectionPrompt.deleteMany({
                where: {
                    collection: {
                        userId: user.id
                    }
                }
            }),
            // Delete user's collections
            prisma.collection.deleteMany({
                where: { userId: user.id }
            }),
            // Delete ratings on user's prompts
            prisma.rating.deleteMany({
                where: {
                    prompt: {
                        authorId: user.id
                    }
                }
            }),
            // Delete favorites on user's prompts
            prisma.favorite.deleteMany({
                where: {
                    prompt: {
                        authorId: user.id
                    }
                }
            }),
            // Delete collection prompts referencing user's prompts
            prisma.collectionPrompt.deleteMany({
                where: {
                    prompt: {
                        authorId: user.id
                    }
                }
            }),
            // Delete user's prompts
            prisma.prompt.deleteMany({
                where: { authorId: user.id }
            }),
            // Finally delete the user
            prisma.user.delete({
                where: { id: user.id }
            }),
        ])

        return NextResponse.json({
            message: "Account deleted successfully"
        })
    } catch (error) {
        console.error("Delete account error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
