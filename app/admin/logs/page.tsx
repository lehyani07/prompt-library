export default function LogsPage() {
    // Mock logs data - in production, this would read from actual log files
    const logs = [
        { id: 1, timestamp: new Date().toISOString(), level: 'info', message: 'User logged in', user: 'admin@example.com' },
        { id: 2, timestamp: new Date().toISOString(), level: 'error', message: 'Failed to create prompt', user: 'user@example.com' },
        { id: 3, timestamp: new Date().toISOString(), level: 'warn', message: 'Rate limit exceeded', user: 'unknown' },
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${log.level === 'error' ? 'bg-red-100 text-red-800' :
                                            log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'}`}>
                                        {log.level.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{log.message}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.user}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
