import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET all prompts
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const isPublic = searchParams.get('public') === 'true'

        const prompts = await prisma.prompt.findMany({
            where: isPublic ? { isPublic: true } : undefined,
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    }
                },
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
        })

        return NextResponse.json(prompts)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch prompts" },
            { status: 500 }
        )
    }
}

// POST create new prompt
export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const { title, content, description, isPublic, categoryId } = await request.json()

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            )
        }

        const prompt = await prisma.prompt.create({
            data: {
                title,
                content,
                description,
                isPublic: isPublic || false,
                authorId: user.id,
                categoryId: categoryId || null
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

        return NextResponse.json(prompt, { status: 201 })
    } catch (error) {
        console.error("Create prompt error:", error)
        return NextResponse.json(
            { error: "Failed to create prompt" },
            { status: 500 }
        )
    }
}
