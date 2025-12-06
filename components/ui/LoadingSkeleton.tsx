export default function LoadingSkeleton({ count = 1 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="h-4 bg-neutral-bg-soft rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-neutral-bg-soft rounded w-1/2"></div>
                </div>
            ))}
        </div>
    )
}

export function PromptCardSkeleton() {
    return (
        <div className="bg-neutral-bg-card rounded-lg p-6 shadow-card animate-pulse">
            <div className="h-6 bg-neutral-bg-soft rounded w-3/4 mb-4"></div>
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-neutral-bg-soft rounded"></div>
                <div className="h-4 bg-neutral-bg-soft rounded w-5/6"></div>
                <div className="h-4 bg-neutral-bg-soft rounded w-4/6"></div>
            </div>
            <div className="flex gap-2 mb-4">
                <div className="h-6 bg-neutral-bg-soft rounded-pill w-20"></div>
                <div className="h-6 bg-neutral-bg-soft rounded-pill w-24"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="h-4 bg-neutral-bg-soft rounded w-24"></div>
                <div className="h-9 bg-neutral-bg-soft rounded-pill w-28"></div>
            </div>
        </div>
    )
}

export function TableSkeleton() {
    return (
        <div className="bg-neutral-bg-card rounded-lg overflow-hidden shadow-card">
            <div className="animate-pulse">
                {/* Header */}
                <div className="border-b border-neutral-border-subtle p-4">
                    <div className="h-4 bg-neutral-bg-soft rounded w-32"></div>
                </div>
                {/* Rows */}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-neutral-border-subtle p-4 flex gap-4">
                        <div className="h-4 bg-neutral-bg-soft rounded flex-1"></div>
                        <div className="h-4 bg-neutral-bg-soft rounded w-24"></div>
                        <div className="h-4 bg-neutral-bg-soft rounded w-20"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="bg-neutral-bg-card rounded-lg p-6 shadow-card animate-pulse">
            <div className="h-4 bg-neutral-bg-soft rounded w-24 mb-4"></div>
            <div className="h-8 bg-neutral-bg-soft rounded w-16"></div>
        </div>
    )
}
