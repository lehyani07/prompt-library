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
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change && (
                        <p className="text-sm text-green-600 mt-1">{change}</p>
                    )}
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                    <Icon className="h-8 w-8 text-indigo-600" />
                </div>
            </div>
        </div>
    )
}
