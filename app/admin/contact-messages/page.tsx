import { prisma } from "@/lib/prisma"
import ContactMessagesContent from "@/components/admin/ContactMessagesContent"

const ITEMS_PER_PAGE = 20

export default async function ContactMessagesPage({
    searchParams
}: {
    searchParams: Promise<{ read?: string; page?: string }>
}) {
    const params = await searchParams
    const page = parseInt(params.page || "1", 10)
    const read = params.read === "true" ? true : params.read === "false" ? false : undefined
    const skip = (page - 1) * ITEMS_PER_PAGE

    const where: any = {}
    if (read !== undefined) {
        where.read = read
    }

    try {
        // Check if contactMessage model exists in Prisma Client
        if (!prisma.contactMessage) {
            throw new Error("ContactMessage model not found in Prisma Client. Please run 'npx prisma generate' and restart the server.")
        }

        const [messages, totalCount, unreadCount] = await Promise.all([
            prisma.contactMessage.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: ITEMS_PER_PAGE,
                skip,
            }),
            prisma.contactMessage.count({ where }),
            prisma.contactMessage.count({ where: { read: false } }),
        ])

        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

        return (
            <ContactMessagesContent
                initialMessages={messages}
                initialTotalCount={totalCount}
                initialUnreadCount={unreadCount}
                currentPage={page}
                totalPages={totalPages}
                itemsPerPage={ITEMS_PER_PAGE}
                filterRead={read}
            />
        )
    } catch (error: any) {
        // If contactMessage doesn't exist, return empty state with error message
        console.error("Error loading contact messages:", error)
        return (
            <div className="p-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                        Prisma Client needs to be regenerated
                    </h2>
                    <p className="text-yellow-700 mb-4">
                        The ContactMessage model was added to the database, but Prisma Client hasn't been updated yet.
                    </p>
                    <div className="bg-white rounded p-4 font-mono text-sm">
                        <p className="mb-2">Please run these commands:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Stop the dev server (Ctrl+C)</li>
                            <li>Run: <code className="bg-gray-100 px-2 py-1 rounded">npx prisma generate</code></li>
                            <li>Restart the dev server: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
                        </ol>
                    </div>
                </div>
            </div>
        )
    }
}

