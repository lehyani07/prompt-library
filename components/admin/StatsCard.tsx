import {
    UsersIcon,
    DocumentTextIcon,
    GlobeAltIcon,
    StarIcon
} from "@heroicons/react/24/outline"

const icons = {
    users: UsersIcon,
    document: DocumentTextIcon,
    globe: GlobeAltIcon,
    star: StarIcon,
}

interface StatsCardProps {
    title: string
    value: number
    change?: string
    icon: keyof typeof icons
}

export default function StatsCard({ title, value, change, icon }: StatsCardProps) {
    const Icon = icons[icon]

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-card p-6 hover:shadow-floating transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-neutral-text-secondary">{title}</p>
                    <p className="text-3xl font-bold text-neutral-text-primary mt-2">{value.toLocaleString()}</p>
                    {change && (
                        <p className="text-sm font-medium text-green-600 mt-1 flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                            {change}
                        </p>
                    )}
                </div>
                <div className="bg-linear-to-br from-primary-base/10 to-secondary-base/10 p-3.5 rounded-xl border border-primary-base/5">
                    <Icon className="h-7 w-7 text-primary-base" />
                </div>
            </div>
        </div>
    )
}
