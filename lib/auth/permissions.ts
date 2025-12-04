import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function requireAdmin() {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user || user.role !== "ADMIN") {
        throw new Error("Forbidden: Admin access required")
    }

    return user
}

export async function requireModerator() {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
        throw new Error("Forbidden: Moderator access required")
    }

    return user
}

export async function hasPermission(requiredRole: "USER" | "MODERATOR" | "ADMIN") {
    const session = await auth()
    if (!session?.user?.email) return false

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) return false

    const roleHierarchy = { USER: 0, MODERATOR: 1, ADMIN: 2 }
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}
