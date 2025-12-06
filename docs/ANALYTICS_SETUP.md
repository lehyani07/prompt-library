# Analytics Setup Guide

## Google Analytics Integration

### 1. Get Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use existing one
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Add to Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Add Components to Layout

Update `app/layout.tsx`:

```tsx
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleAnalytics />
        <AnalyticsProvider>
          {/* Your providers */}
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  )
}
```

### 4. Track Custom Events

Import and use the analytics helper:

```tsx
import { analytics } from '@/lib/analytics'

// Track user signup
analytics.signUp()

// Track prompt creation
analytics.createPrompt()

// Track search
analytics.search('AI prompts')

// Track theme toggle
analytics.toggleTheme('dark')
```

## Available Events

### User Events
- `analytics.signUp()` - User registration
- `analytics.signIn()` - User login

### Content Events
- `analytics.createPrompt()` - Prompt creation
- `analytics.viewPrompt(id)` - Prompt view
- `analytics.copyPrompt(id)` - Prompt copy
- `analytics.ratePrompt(rating)` - Prompt rating

### Engagement Events
- `analytics.search(query)` - Search query
- `analytics.createCollection()` - Collection creation
- `analytics.addToFavorites()` - Add to favorites

### Settings Events
- `analytics.toggleTheme(theme)` - Theme change
- `analytics.changeLanguage(lang)` - Language change

## Custom Event Tracking

```tsx
import { trackEvent } from '@/lib/analytics'

trackEvent({
  action: 'custom_action',
  category: 'custom_category',
  label: 'optional_label',
  value: 123, // optional numeric value
})
```

## Privacy & GDPR Compliance

### Cookie Consent

Consider adding a cookie consent banner:

```tsx
// Example with react-cookie-consent
import CookieConsent from 'react-cookie-consent'

<CookieConsent
  enableDeclineButton
  onAccept={() => {
    // Enable analytics
  }}
  onDecline={() => {
    // Disable analytics
  }}
>
  This website uses cookies to enhance the user experience.
</CookieConsent>
```

### Anonymize IP

Already configured in the analytics setup:

```javascript
gtag('config', 'GA_MEASUREMENT_ID', {
  anonymize_ip: true, // Anonymize IP addresses
})
```

## Alternative: Plausible Analytics

For privacy-focused analytics, use Plausible:

### 1. Install

```bash
npm install next-plausible
```

### 2. Setup

```tsx
import PlausibleProvider from 'next-plausible'

<PlausibleProvider domain="yourdomain.com">
  {children}
</PlausibleProvider>
```

### 3. Track Events

```tsx
import { usePlausible } from 'next-plausible'

const plausible = usePlausible()
plausible('signup')
```

## Testing

### Development Mode

Analytics is disabled in development by default. To test:

1. Set `NODE_ENV=production` temporarily
2. Or use Google Analytics Debug Mode
3. Check Real-Time reports in GA dashboard

### Verify Installation

1. Open Google Analytics
2. Go to Real-Time reports
3. Visit your site
4. Check if your visit appears

## Best Practices

1. **Don't track PII** - Never send personal information
2. **Respect DNT** - Honor Do Not Track settings
3. **Cookie consent** - Get user consent before tracking
4. **Anonymize IPs** - Enable IP anonymization
5. **Test thoroughly** - Verify events in GA dashboard
6. **Monitor performance** - Analytics shouldn't slow down your site

## Troubleshooting

### Events not showing up?

1. Check if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
2. Verify Measurement ID format (`G-XXXXXXXXXX`)
3. Check browser console for errors
4. Ensure ad blockers are disabled for testing
5. Wait a few minutes for data to appear in GA

### Page views not tracked?

1. Verify `AnalyticsProvider` is wrapping your app
2. Check if `useAnalytics()` hook is being called
3. Ensure Next.js router is working correctly
