'use client'

import { useState } from "react"

export default function BackupPage() {
    const [isCreating, setIsCreating] = useState(false)

    const handleCreateBackup = async () => {
        setIsCreating(true)
        try {
            // TODO: Implement actual backup creation
            await new Promise(resolve => setTimeout(resolve, 2000))
            alert("Backup created successfully!")
        } catch (error) {
            alert("Failed to create backup")
        } finally {
            setIsCreating(false)
        }
    }

    // Mock backup history
    const backups = [
        { id: 1, name: 'backup_20231201_120000.zip', size: '2.5 MB', date: '2023-12-01 12:00:00' },
        { id: 2, name: 'backup_20231130_120000.zip', size: '2.4 MB', date: '2023-11-30 12:00:00' },
        { id: 3, name: 'backup_20231129_120000.zip', size: '2.3 MB', date: '2023-11-29 12:00:00' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Database Backup</h1>
                <button
                    onClick={handleCreateBackup}
                    disabled={isCreating}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isCreating ? 'Creating...' : 'Create Backup'}
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {backups.map((backup) => (
                            <tr key={backup.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {backup.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {backup.size}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {backup.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        Download
                                    </button>
                                    <button className="text-red-600 hover:text-red-900">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
