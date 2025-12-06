# Image Optimization Guide

## Using Next.js Image Component

Replace standard `<img>` tags with Next.js `<Image>` component for automatic optimization.

### Before (Standard img):
```tsx
<img src="/image.jpg" alt="Description" />
```

### After (Optimized):
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false} // Set to true for above-the-fold images
  placeholder="blur" // Optional: shows blur while loading
  blurDataURL="data:image/..." // Optional: custom blur
/>
```

## Image Configuration

Add to `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
}
```

## Best Practices

1. **Always specify width and height** to prevent layout shift
2. **Use priority for above-the-fold images** (hero images, logos)
3. **Use fill for responsive images** when aspect ratio is unknown
4. **Optimize source images** before uploading (compress, resize)
5. **Use appropriate formats** (WebP/AVIF for modern browsers)

## Examples

### Responsive Image:
```tsx
<div className="relative w-full h-64">
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    className="object-cover"
    priority
  />
</div>
```

### Avatar Image:
```tsx
<Image
  src={user.image || '/default-avatar.png'}
  alt={user.name}
  width={40}
  height={40}
  className="rounded-full"
/>
```

### Card Image:
```tsx
<Image
  src={prompt.image}
  alt={prompt.title}
  width={400}
  height={300}
  className="rounded-lg"
  loading="lazy"
/>
```
