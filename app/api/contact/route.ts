import { NextResponse } from "next/server"
import { sendContactEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, message, website } = body // 'website' is our honeypot field

        // 1. Honeypot Check (Anti-Bot)
        // If the hidden 'website' field is filled, it's a bot.
        // We return success to fool the bot into thinking it worked.
        if (website) {
            console.log("Honeypot triggered by:", email)
            return NextResponse.json({ message: "Message sent successfully" })
        }

        // 2. Input Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Validate lengths to prevent DoS/Storage spam
        if (name.length > 100) {
            return NextResponse.json({ error: "Name is too long (max 100 chars)" }, { status: 400 })
        }
        if (email.length > 255) {
            return NextResponse.json({ error: "Email is too long (max 255 chars)" }, { status: 400 })
        }
        if (message.length > 5000) {
            return NextResponse.json({ error: "Message is too long (max 5000 chars)" }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // 3. Rate Limiting (Simple DB-based)
        // Prevent spamming from the same email address (e.g., max 1 message per minute)
        const ONE_MINUTE_AGO = new Date(Date.now() - 60 * 1000)
        const recentMessage = await prisma.contactMessage.findFirst({
            where: {
                email: email,
                createdAt: {
                    gt: ONE_MINUTE_AGO
                }
            }
        })

        if (recentMessage) {
            return NextResponse.json(
                { error: "Too many messages. Please wait a minute before sending again." },
                { status: 429 }
            )
        }

        // Save message to database
        // Prisma uses parameterized queries, preventing SQL Injection
        const contactMessage = await prisma.contactMessage.create({
            data: {
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
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
