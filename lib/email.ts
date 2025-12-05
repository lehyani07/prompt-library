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

export async function sendContactEmail(name: string, email: string, message: string) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "admin@promptlibrary.com"
    
    try {
        // Send email to admin
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: adminEmail,
            subject: `New Contact Form Submission from ${name}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This message was sent from the Prompt Library contact form.</small></p>
      `,
        })

        // Send confirmation email to user
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Thank you for contacting Prompt Library",
            html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Your message:</p>
        <p><em>${message.replace(/\n/g, '<br>')}</em></p>
        <hr>
        <p><small>This is an automated confirmation email. Please do not reply to this message.</small></p>
      `,
        })
    } catch (error) {
        console.error("Failed to send contact email:", error)
        throw error
    }
}