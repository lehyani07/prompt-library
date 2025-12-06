import { NextResponse } from "next/server"
import { requireModerator } from "@/lib/auth/permissions"
import { prisma } from "@/lib/prisma"
import { adminUpdatePromptSchema } from "@/lib/validations/admin"
import { ZodError } from "zod"

// Update prompt
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireModerator()

        const body = await request.json()

        // Validate input with Zod
        const validatedData = adminUpdatePromptSchema.parse(body)

        const prompt = await prisma.prompt.update({
            where: { id: params.id },
            data: validatedData
        })

        return NextResponse.json(prompt)
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }

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
