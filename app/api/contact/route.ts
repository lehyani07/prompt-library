import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json()

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // TODO: Implement actual email sending functionality
        // For now, we'll just log the message to the console
        console.log("Contact form submission:", { name, email, message })

        return NextResponse.json({ message: "Message sent successfully" })
    } catch (error) {
        console.error("Contact form error:", error)
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        )
    }
}
