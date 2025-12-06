import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { createCollectionSchema } from "@/lib/validations/collection"
import { rateLimitByIP } from "@/lib/rate-limit"
import { ZodError } from "zod"

export async function POST(req: Request) {
    try {
        // Rate limiting
        const ip = req.headers.get("x-forwarded-for") || "unknown"
        const { success } = await rateLimitByIP(ip)

        if (!success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            )
        }

        const session = await auth()

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        const body = await req.json()

        // Validate input with Zod
        const validatedData = createCollectionSchema.parse(body)

        const collection = await prisma.collection.create({
            data: {
                ...validatedData,
                isPublic: validatedData.isPublic ?? false,
                userId: user.id
            }
        })

        return NextResponse.json(collection)
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }

        console.error("[COLLECTIONS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
