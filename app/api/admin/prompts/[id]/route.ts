import { NextResponse } from "next/server"
import { requireModerator } from "@/lib/auth/permissions"
import { prisma } from "@/lib/prisma"

// Update prompt
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireModerator()

        const data = await request.json()

        const prompt = await prisma.prompt.update({
            where: { id: params.id },
            data
        })

        return NextResponse.json(prompt)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update prompt" },
            { status: 500 }
        )
    }
}

// Delete prompt
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireModerator()

        await prisma.prompt.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete prompt" },
            { status: 500 }
        )
    }
}
