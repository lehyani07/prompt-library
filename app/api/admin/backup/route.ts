import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth/permissions"
import fs from "fs"
import path from "path"

const BACKUP_DIR = path.join(process.cwd(), "backups")
const DB_FILE = path.join(process.cwd(), "dev.db")

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

// GET list of backups
export async function GET() {
    try {
        await requireAdmin()

        if (!fs.existsSync(BACKUP_DIR)) {
            return NextResponse.json([])
        }

        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.startsWith("backup_") && file.endsWith(".db"))
            .map(file => {
                const filePath = path.join(BACKUP_DIR, file)
                const stats = fs.statSync(filePath)
                return {
                    name: file,
                    size: formatBytes(stats.size),
                    date: stats.birthtime.toISOString(),
                    createdAt: stats.birthtime.toISOString(),
                }
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        return NextResponse.json(files)
    } catch (error) {
        console.error("Failed to list backups:", error)
        return NextResponse.json(
            { error: "Failed to list backups" },
            { status: 500 }
        )
    }
}

// POST create backup
export async function POST() {
    try {
        await requireAdmin()

        if (!fs.existsSync(DB_FILE)) {
            return NextResponse.json(
                { error: "Database file not found" },
                { status: 404 }
            )
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
        const backupFileName = `backup_${timestamp}.db`
        const backupFilePath = path.join(BACKUP_DIR, backupFileName)

        // Copy database file
        fs.copyFileSync(DB_FILE, backupFilePath)

        // Clean up old backups (keep only last 7 days)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
        const files = fs.readdirSync(BACKUP_DIR)
        files.forEach(file => {
            if (file.startsWith("backup_") && file.endsWith(".db")) {
                const filePath = path.join(BACKUP_DIR, file)
                const stats = fs.statSync(filePath)
                if (stats.birthtime.getTime() < sevenDaysAgo) {
                    fs.unlinkSync(filePath)
                }
            }
        })

        const stats = fs.statSync(backupFilePath)
        return NextResponse.json({
            message: "Backup created successfully",
            backup: {
                name: backupFileName,
                size: formatBytes(stats.size),
                date: stats.birthtime.toISOString(),
            }
        })
    } catch (error) {
        console.error("Failed to create backup:", error)
        return NextResponse.json(
            { error: "Failed to create backup" },
            { status: 500 }
        )
    }
}

// DELETE backup
export async function DELETE(request: Request) {
    try {
        await requireAdmin()

        const { searchParams } = new URL(request.url)
        const fileName = searchParams.get("file")

        if (!fileName) {
            return NextResponse.json(
                { error: "File name is required" },
                { status: 400 }
            )
        }

        // Security: ensure file is in backup directory and is a backup file
        if (!fileName.startsWith("backup_") || !fileName.endsWith(".db")) {
            return NextResponse.json(
                { error: "Invalid file name" },
                { status: 400 }
            )
        }

        const filePath = path.join(BACKUP_DIR, fileName)

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: "Backup file not found" },
                { status: 404 }
            )
        }

        fs.unlinkSync(filePath)

        return NextResponse.json({ message: "Backup deleted successfully" })
    } catch (error) {
        console.error("Failed to delete backup:", error)
        return NextResponse.json(
            { error: "Failed to delete backup" },
            { status: 500 }
        )
    }
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}




