#!/usr/bin/env node

/**
 * Database Backup Script
 * 
 * Usage:
 *   node scripts/backup-database.js
 * 
 * Environment variables required:
 *   DATABASE_URL - PostgreSQL connection string
 *   BACKUP_DIR - Directory to store backups (default: ./backups)
 */

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '../backups')
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required')
    process.exit(1)
}

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`)

console.log('🔄 Starting database backup...')
console.log(`📁 Backup location: ${backupFile}`)

// Extract database connection details from DATABASE_URL
const dbUrl = new URL(DATABASE_URL)
const dbName = dbUrl.pathname.slice(1)
const dbHost = dbUrl.hostname
const dbPort = dbUrl.port || '5432'
const dbUser = dbUrl.username
const dbPassword = dbUrl.password

// For SQLite
if (DATABASE_URL.startsWith('file:')) {
    const sqliteFile = DATABASE_URL.replace('file:', '')
    const command = `cp ${sqliteFile} ${backupFile.replace('.sql', '.db')}`

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Backup failed:', error.message)
            process.exit(1)
        }

        console.log('✅ Backup completed successfully!')
        console.log(`📦 Backup file: ${backupFile.replace('.sql', '.db')}`)

        // Clean up old backups (keep last 7 days)
        cleanupOldBackups()
    })
}
// For PostgreSQL
else if (DATABASE_URL.startsWith('postgresql:')) {
    const command = `PGPASSWORD="${dbPassword}" pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c -f ${backupFile}`

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Backup failed:', error.message)
            console.error('Make sure pg_dump is installed: https://www.postgresql.org/download/')
            process.exit(1)
        }

        if (stderr) {
            console.log('⚠️  Warnings:', stderr)
        }

        console.log('✅ Backup completed successfully!')
        console.log(`📦 Backup file: ${backupFile}`)

        // Get file size
        const stats = fs.statSync(backupFile)
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)
        console.log(`📊 Backup size: ${fileSizeMB} MB`)

        // Clean up old backups (keep last 7 days)
        cleanupOldBackups()
    })
} else {
    console.error('❌ Unsupported database type')
    process.exit(1)
}

function cleanupOldBackups() {
    const files = fs.readdirSync(BACKUP_DIR)
    const backupFiles = files.filter(f => f.startsWith('backup-'))

    if (backupFiles.length > 7) {
        // Sort by date (oldest first)
        backupFiles.sort()

        // Delete old backups
        const toDelete = backupFiles.slice(0, backupFiles.length - 7)
        toDelete.forEach(file => {
            const filePath = path.join(BACKUP_DIR, file)
            fs.unlinkSync(filePath)
            console.log(`🗑️  Deleted old backup: ${file}`)
        })
    }

    console.log(`📁 Total backups: ${Math.min(backupFiles.length, 7)}`)
}
