import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET single prompt
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const prompt = await prisma.prompt.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                category: true,
                ratings: true,
                _count: {
                    select: {
                        favorites: true,
                        ratings: true
                    }
                }
            }
        })

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(prompt)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch prompt" },
            { status: 500 }
        )
    }
}

// PUT update prompt
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const prompt = await prisma.prompt.findUnique({
            where: { id: params.id },
            include: {
                author: true
            }
        })

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt not found" },
                { status: 404 }
            )
        }

        if (prompt.author.email !== session.user.email) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        const { title, content, description, isPublic, categoryId } = await request.json()

        const updatedPrompt = await prisma.prompt.update({
            where: { id: params.id },
            data: {
                title,
                content,
                description,
                isPublic,
                categoryId
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                category: true
            }
        })

        return NextResponse.json(updatedPrompt)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update prompt" },
            { status: 500 }
        )
    }
}

// DELETE prompt
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const prompt = await prisma.prompt.findUnique({
            where: { id: params.id },
            include: {
                author: true
            }
        })

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt not found" },
                { status: 404 }
            )
        }

        if (prompt.author.email !== session.user.email) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        await prisma.prompt.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: "Prompt deleted successfully" })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete prompt" },
            { status: 500 }
        )
    }
}
