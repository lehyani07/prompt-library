'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DailyStatsChartProps {
    data: Array<{
        date: string
        users: number
        prompts: number
        ratings: number
    }>
}

export default function DailyStatsChart({ data }: DailyStatsChartProps) {
    return (
        <div className="bg-neutral-bg-card rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold text-neutral-text-primary mb-4">
                Daily Activity (Last 30 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1E4EC" />
                    <XAxis
                        dataKey="date"
                        stroke="#6F7483"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6F7483"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E1E4EC',
                            borderRadius: '8px',
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#2D8CFF"
                        strokeWidth={2}
                        name="New Users"
                    />
                    <Line
                        type="monotone"
                        dataKey="prompts"
                        stroke="#9B5CFF"
                        strokeWidth={2}
                        name="New Prompts"
                    />
                    <Line
                        type="monotone"
                        dataKey="ratings"
                        stroke="#00C48C"
                        strokeWidth={2}
                        name="New Ratings"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
