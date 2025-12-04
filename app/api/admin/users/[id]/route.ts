import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/permissions"
import { prisma } from "@/lib/prisma"

// Update user (role, status, etc.)
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin()

        const { role, status, name, email } = await request.json()

        const user = await prisma.user.update({
            where: { id: params.id },
            data: {
                ...(role && { role }),
                ...(status && { status }),
                ...(name && { name }),
                ...(email && { email }),
            }
        })

        return NextResponse.json(user)
    } catch (error) {
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
