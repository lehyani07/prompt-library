import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/permissions"
import { prisma } from "@/lib/prisma"

// GET all contact messages
export async function GET(request: Request) {
    try {
        await requireAdmin()

        const { searchParams } = new URL(request.url)
        const countOnly = searchParams.get("count") === "true"
        
        // If only count is requested, return unread count
        if (countOnly) {
            const unreadCount = await prisma.contactMessage.count({
                where: { read: false },
            })
            return NextResponse.json({ unreadCount })
        }

        const read = searchParams.get("read")
        const page = parseInt(searchParams.get("page") || "1", 10)
        const limit = parseInt(searchParams.get("limit") || "20", 10)
        const skip = (page - 1) * limit

        const where: any = {}
        if (read !== null) {
            where.read = read === "true"
        }

        const [messages, totalCount] = await Promise.all([
            prisma.contactMessage.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit,
                skip,
            }),
            prisma.contactMessage.count({ where }),
        ])

        return NextResponse.json({
            messages,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        })
    } catch (error) {
        console.error("Failed to fetch contact messages:", error)
        return NextResponse.json(
            { error: "Failed to fetch contact messages" },
            { status: 500 }
        )
    }
}

// PATCH mark all as read
export async function PATCH(request: Request) {
    try {
        await requireAdmin()

        const { searchParams } = new URL(request.url)
        const markAllAsRead = searchParams.get("markAllAsRead") === "true"

        if (markAllAsRead) {
            const result = await prisma.contactMessage.updateMany({
                where: { read: false },
                data: { read: true },
            })

            return NextResponse.json({ 
                message: "All messages marked as read",
                count: result.count 
            })
        }

        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        )
    } catch (error) {
        console.error("Failed to mark all as read:", error)
        return NextResponse.json(
            { error: "Failed to mark all as read" },
            { status: 500 }
        )
    }
}

// DELETE contact message
export async function DELETE(request: Request) {
    try {
        await requireAdmin()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                { error: "Message ID is required" },
                { status: 400 }
            )
        }

        await prisma.contactMessage.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Message deleted successfully" })
    } catch (error) {
        console.error("Failed to delete contact message:", error)
        return NextResponse.json(
            { error: "Failed to delete contact message" },
            { status: 500 }
        )
    }
}

