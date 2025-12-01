import { dictionaries } from './dictionaries'

// Map category slugs to translation keys
const categorySlugToKeyMap: Record<string, keyof typeof dictionaries.en.categories> = {
    'art-design': 'artDesign',
    'business': 'business',
    'coding': 'coding',
    'creative-writing': 'creativeWriting',
    'education': 'education',
    'productivity': 'productivity',
}

export function getCategoryTranslation(categoryName: string, locale: 'en' | 'ar'): string {
    // Try to match by exact name first
    const slug = Object.keys(categorySlugToKeyMap).find(
        key => dictionaries.en.categories[categorySlugToKeyMap[key]].toLowerCase() === categoryName.toLowerCase()
    )

    if (slug) {
        const key = categorySlugToKeyMap[slug]
        return dictionaries[locale].categories[key]
    }

    // Fallback to original name if no match found
    return categoryName
}

export function getCategoryTranslationBySlug(slug: string, locale: 'en' | 'ar'): string {
    const key = categorySlugToKeyMap[slug]
    if (key) {
        return dictionaries[locale].categories[key]
    }
    return slug
}
