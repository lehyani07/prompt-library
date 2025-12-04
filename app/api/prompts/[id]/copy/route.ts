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
                copyCount: {
                    increment: 1
                }
            },
            select: {
                copyCount: true
            }
        })

        return NextResponse.json({ copyCount: prompt.copyCount })
    } catch (error) {
        console.error("Copy count error:", error)
        return NextResponse.json(
            { error: "Failed to update copy count" },
            { status: 500 }
        )
    }
}
