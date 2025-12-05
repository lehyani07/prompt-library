import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/permissions"
import fs from "fs"
import path from "path"

const BACKUP_DIR = path.join(process.cwd(), "backups")

// GET download backup file
export async function GET(
    request: Request,
    { params }: { params: Promise<{ file: string }> }
) {
    try {
        await requireAdmin()

        const { file } = await params

        // Security: ensure file is in backup directory and is a backup file
        if (!file.startsWith("backup_") || !file.endsWith(".db")) {
            return NextResponse.json(
                { error: "Invalid file name" },
                { status: 400 }
            )
        }

        const filePath = path.join(BACKUP_DIR, file)

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: "Backup file not found" },
                { status: 404 }
            )
        }

        const fileBuffer = fs.readFileSync(filePath)
        const stats = fs.statSync(filePath)

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename="${file}"`,
                "Content-Length": stats.size.toString(),
            },
        })
    } catch (error) {
        console.error("Failed to download backup:", error)
        return NextResponse.json(
            { error: "Failed to download backup" },
            { status: 500 }
        )
    }
}

