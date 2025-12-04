import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { createPromptSchema } from "@/lib/validations/prompt"
import { rateLimitByIP } from "@/lib/rate-limit"
import { ZodError } from "zod"
import logger from "@/lib/logger"

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

// POST create new prompt with validation and rate limiting
export async function POST(request: Request) {
    try {
        // Rate limiting
        const ip = request.headers.get("x-forwarded-for") || "unknown"
        const { success } = await rateLimitByIP(ip)

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            )
        }

        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const body = await request.json()

        // Validate input with Zod
        const validatedData = createPromptSchema.parse(body)

        const prompt = await prisma.prompt.create({
            data: {
                ...validatedData,
                isPublic: validatedData.isPublic ?? false,
                authorId: user.id,
            },
            include: {
                author: { select: { name: true, email: true } },
                category: true
            }
        })

        logger.info("Prompt created", {
            promptId: prompt.id,
            userId: user.id,
            title: prompt.title,
        })

        return NextResponse.json(prompt, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: (error as any).errors },
                { status: 400 }
            )
        }

        logger.error("Failed to create prompt", {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
        })

        return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 })
    }
}
