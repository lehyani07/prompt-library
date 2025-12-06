import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/settings/', '/library/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
