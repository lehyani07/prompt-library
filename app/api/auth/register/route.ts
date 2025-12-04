import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { registerSchema } from "@/lib/validations/user"
import { ZodError } from "zod"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

const SALT_ROUNDS = 12

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate input with Zod
        const { name, email, password } = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        // Hash password with stronger salt
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                verificationToken,
                verificationTokenExpiry,
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        // Send verification email
        await sendVerificationEmail(email, verificationToken)

        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            )
        }

        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
