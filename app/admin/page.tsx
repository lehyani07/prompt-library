import { prisma } from "@/lib/prisma"
import StatsCard from "@/components/admin/StatsCard"

export const metadata = {
    title: "Admin Dashboard",
}

export default async function AdminDashboard() {
    // Fetch statistics in parallel
    const [
        totalUsers,
        totalPrompts,
        publicPrompts,
        totalRatings,
        totalFavorites,
        recentUsers,
        recentPrompts,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.prompt.count(),
        prisma.prompt.count({ where: { isPublic: true } }),
        prisma.rating.count(),
        prisma.favorite.count(),
        // Users created in the last 7 days
        prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        }),
        // Prompts created in the last 7 days
        prisma.prompt.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        }),
    ])

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={totalUsers}
                    change={`+${recentUsers} this week`}
                    icon="users"
                />
                <StatsCard
                    title="Total Prompts"
                    value={totalPrompts}
                    change={`+${recentPrompts} this week`}
                    icon="document"
                />
                <StatsCard title="Public Prompts" value={publicPrompts} icon="globe" />
                <StatsCard title="Total Ratings" value={totalRatings} icon="star" />
                <StatsCard title="Total Favorites" value={totalFavorites} icon="star" />
            </div>
        </div>
    )
}
