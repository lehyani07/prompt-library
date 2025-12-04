import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params

        const prompt = await prisma.prompt.update({
            where: { id: resolvedParams.id },
            data: {
                viewCount: {
                    increment: 1
                }
            },
            select: {
                viewCount: true
            }
        })

        return NextResponse.json({ viewCount: prompt.viewCount })
    } catch (error) {
        console.error("View count error:", error)
        return NextResponse.json(
            { error: "Failed to update view count" },
            { status: 500 }
        )
    }
}
