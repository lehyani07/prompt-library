import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/permissions"
import { prisma } from "@/lib/prisma"
import { adminUpdateUserSchema } from "@/lib/validations/admin"
import { ZodError } from "zod"

// Update user (role, status, etc.)
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin()

        const body = await request.json()

        // Validate input with Zod
        const validatedData = adminUpdateUserSchema.parse(body)

        // If email is being updated, check if it already exists
        if (validatedData.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: validatedData.email }
            })

            if (existingUser && existingUser.id !== params.id) {
                return NextResponse.json(
                    { error: "Email already in use" },
                    { status: 400 }
                )
            }
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: validatedData
        })

        return NextResponse.json(user)
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        )
    }
}

// Delete user
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin()

        await prisma.user.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        )
    }
}
