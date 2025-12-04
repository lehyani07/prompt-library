import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                _count: { select: { prompts: true } },
            },
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error("Admin users fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
}
