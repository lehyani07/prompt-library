import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
        return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiry: {
                    gt: new Date(),
                },
            },
        })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            )
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null,
                verificationTokenExpiry: null,
            },
        })

        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/verified`)
    } catch (error) {
        return NextResponse.json(
            { error: "Verification failed" },
            { status: 500 }
        )
    }
}
