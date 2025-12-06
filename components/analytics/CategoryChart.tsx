'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CategoryChartProps {
    data: Array<{
        name: string
        _count: { prompts: number }
    }>
}

export default function CategoryChart({ data }: CategoryChartProps) {
    const chartData = data.map(cat => ({
        name: cat.name,
        prompts: cat._count.prompts,
    }))

    return (
        <div className="bg-neutral-bg-card rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold text-neutral-text-primary mb-4">
                Prompts by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E1E4EC" />
                    <XAxis
                        dataKey="name"
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
                    <Bar
                        dataKey="prompts"
                        fill="#2D8CFF"
                        radius={[8, 8, 0, 0]}
                        name="Prompts"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
