export function generateWebsiteSchema() {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Prompt Library',
        description: 'The best place to find, create, and organize prompts for ChatGPT, Claude, Midjourney, and more.',
        url: baseUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/explore?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en', 'ar'],
    }
}

export function generateOrganizationSchema() {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'

    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Prompt Library',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'A community-driven platform for discovering and sharing AI prompts.',
        sameAs: [
            // Add your social media links here
            // 'https://twitter.com/promptlibrary',
            // 'https://github.com/promptlibrary',
        ],
    }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
        })),
    }
}

export function generatePromptSchema(prompt: {
    id: string
    title: string
    description: string
    content: string
    author: { name: string }
    createdAt: Date
    avgRating?: number
    ratingCount?: number
}) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'

    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: prompt.title,
        description: prompt.description,
        text: prompt.content,
        author: {
            '@type': 'Person',
            name: prompt.author.name,
        },
        datePublished: prompt.createdAt.toISOString(),
        url: `${baseUrl}/prompts/${prompt.id}`,
        ...(prompt.avgRating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: prompt.avgRating,
                ratingCount: prompt.ratingCount || 0,
                bestRating: 5,
                worstRating: 1,
            },
        }),
    }
}
