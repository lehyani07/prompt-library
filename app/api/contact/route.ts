import { NextResponse } from "next/server"
import { sendContactEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json()

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // Save message to database
        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                message,
            }
        })

        // Send email if SMTP is configured
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                await sendContactEmail(name, email, message)
            } catch (emailError) {
                console.error("Failed to send email:", emailError)
                // Message is already saved in database, so we continue
            }
        }

        return NextResponse.json({ message: "Message sent successfully" })
    } catch (error) {
        console.error("Contact form error:", error)
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        )
    }
}
