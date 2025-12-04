import { prisma } from "@/lib/prisma"
import DashboardContent from "@/components/admin/DashboardContent"

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
        <DashboardContent
            totalUsers={totalUsers}
            totalPrompts={totalPrompts}
            publicPrompts={publicPrompts}
            totalRatings={totalRatings}
            totalFavorites={totalFavorites}
            recentUsers={recentUsers}
            recentPrompts={recentPrompts}
        />
    )
}
