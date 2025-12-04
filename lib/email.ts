import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Verify your email - Prompt Library",
            html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
        })
    } catch (error) {
        console.error("Failed to send verification email:", error)
        // Don't throw error to avoid blocking registration, but log it
    }
}
