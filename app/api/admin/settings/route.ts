import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/permissions"
import { prisma } from "@/lib/prisma"

// GET settings
export async function GET() {
    try {
        await requireAdmin()

        let settings = await prisma.settings.findUnique({
            where: { id: "site-settings" }
        })

        // If settings don't exist, create default settings
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    id: "site-settings",
                    siteName: "Prompt Library",
                    siteDescription: "A library of AI prompts",
                    allowRegistration: true,
                    requireEmailVerification: false,
                    moderatePrompts: false,
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error("Failed to fetch settings:", error)
        return NextResponse.json(
            { error: "Failed to fetch settings" },
            { status: 500 }
        )
    }
}

// PUT update settings
export async function PUT(request: Request) {
    try {
        await requireAdmin()

        const data = await request.json()

        const settings = await prisma.settings.upsert({
            where: { id: "site-settings" },
            update: {
                siteName: data.siteName,
                siteDescription: data.siteDescription,
                allowRegistration: data.allowRegistration,
                requireEmailVerification: data.requireEmailVerification,
                moderatePrompts: data.moderatePrompts,
            },
            create: {
                id: "site-settings",
                siteName: data.siteName || "Prompt Library",
                siteDescription: data.siteDescription || "A library of AI prompts",
                allowRegistration: data.allowRegistration !== undefined ? data.allowRegistration : true,
                requireEmailVerification: data.requireEmailVerification !== undefined ? data.requireEmailVerification : false,
                moderatePrompts: data.moderatePrompts !== undefined ? data.moderatePrompts : false,
            }
        })

        return NextResponse.json(settings)
    } catch (error) {
        console.error("Failed to update settings:", error)
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        )
    }
}




