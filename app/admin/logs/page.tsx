import LogsPageContent from "@/components/admin/LogsPageContent"

export default function LogsPage() {
    // Mock logs data - in production, this would read from actual log files
    const logs = [
        { id: 1, timestamp: new Date().toISOString(), level: 'info', message: 'User logged in', user: 'admin@example.com' },
        { id: 2, timestamp: new Date().toISOString(), level: 'error', message: 'Failed to create prompt', user: 'user@example.com' },
        { id: 3, timestamp: new Date().toISOString(), level: 'warn', message: 'Rate limit exceeded', user: 'unknown' },
    ]

    return <LogsPageContent logs={logs} />
}
