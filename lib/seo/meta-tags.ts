export function generateMetaTags({
    title,
    description,
    image,
    url,
    type = 'website',
    noindex = false,
}: {
    title: string
    description: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    noindex?: boolean
}) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl
    const ogImage = image || `${baseUrl}/og-image.png`

    return {
        title,
        description,
        ...(noindex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
        openGraph: {
            type,
            url: fullUrl,
            title,
            description,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            siteName: 'Prompt Library',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
            creator: '@promptlibrary',
        },
    }
}

export function generateCanonicalUrl(path: string) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'
    return `${baseUrl}${path}`
}
