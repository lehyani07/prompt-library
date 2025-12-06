import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'If an account exists with this email, you will receive a password reset link.',
            })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        })

        // Send reset email
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${resetToken}`

        try {
            await sendEmail({
                to: email,
                subject: 'Password Reset Request',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D8CFF;">Password Reset Request</h2>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2D8CFF; color: white; text-decoration: none; border-radius: 999px; margin: 20px 0;">
              Reset Password
            </a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #6F7483; word-break: break-all;">${resetUrl}</p>
            <p style="color: #6F7483; font-size: 14px; margin-top: 20px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>
        `,
            })
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError)
            // Continue anyway - don't reveal email sending failure
        }

        return NextResponse.json({
            message: 'If an account exists with this email, you will receive a password reset link.',
        })
    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        )
    }
}
