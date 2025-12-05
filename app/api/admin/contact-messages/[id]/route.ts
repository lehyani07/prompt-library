import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/permissions"
import { prisma } from "@/lib/prisma"

// GET single contact message
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()

        const { id } = await params

        const message = await prisma.contactMessage.findUnique({
            where: { id },
        })

        if (!message) {
            return NextResponse.json(
                { error: "Message not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(message)
    } catch (error) {
        console.error("Failed to fetch contact message:", error)
        return NextResponse.json(
            { error: "Failed to fetch contact message" },
            { status: 500 }
        )
    }
}

// PATCH mark as read/unread
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()

        const { id } = await params
        const { read } = await request.json()

        const message = await prisma.contactMessage.update({
            where: { id },
            data: { read: read === true },
        })

        return NextResponse.json(message)
    } catch (error) {
        console.error("Failed to update contact message:", error)
        return NextResponse.json(
            { error: "Failed to update contact message" },
            { status: 500 }
        )
    }
}



