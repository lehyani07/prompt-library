import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

// PUT change password
export async function PUT(request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = changePasswordSchema.parse(body)

        // Get user with current password
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                password: true,
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Check if user has a password (might be OAuth user)
        if (!user.password) {
            return NextResponse.json(
                { error: "Cannot change password for OAuth accounts" },
                { status: 400 }
            )
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(
            validatedData.currentPassword,
            user.password
        )

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12)

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
            }
        })

        return NextResponse.json({
            message: "Password changed successfully"
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            )
        }

        console.error("Change password error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
