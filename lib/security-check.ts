/**
 * Security checks to run at application startup
 * Validates critical environment variables and configurations
 */

const WEAK_SECRETS = [
    'CHANGE_THIS_IN_PRODUCTION',
    'your_secret_here',
    'secret',
    'test',
    'development',
]

export function checkSecurityConfig() {
    const warnings: string[] = []
    const errors: string[] = []

    // Check NEXTAUTH_SECRET
    const nextAuthSecret = process.env.NEXTAUTH_SECRET

    if (!nextAuthSecret) {
        errors.push('❌ CRITICAL: NEXTAUTH_SECRET is not set!')
    } else if (nextAuthSecret.length < 32) {
        warnings.push('⚠️  WARNING: NEXTAUTH_SECRET is too short (minimum 32 characters recommended)')
    } else if (WEAK_SECRETS.some(weak => nextAuthSecret.includes(weak))) {
        errors.push('❌ CRITICAL: NEXTAUTH_SECRET appears to be a default/weak value!')
    }

    // Check NEXTAUTH_URL
    if (!process.env.NEXTAUTH_URL) {
        warnings.push('⚠️  WARNING: NEXTAUTH_URL is not set')
    }

    // Check if running in production
    if (process.env.NODE_ENV === 'production') {
        // In production, be stricter
        if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
            warnings.push('⚠️  WARNING: Redis rate limiting not configured (recommended for production)')
        }
    }

    // Log warnings and errors
    if (warnings.length > 0) {
        console.warn('\n🔐 Security Configuration Warnings:')
        warnings.forEach(w => console.warn(w))
    }

    if (errors.length > 0) {
        console.error('\n🚨 Security Configuration Errors:')
        errors.forEach(e => console.error(e))

        if (process.env.NODE_ENV === 'production') {
            throw new Error('Critical security configuration errors detected. Application cannot start.')
        } else {
            console.warn('\n⚠️  Running in development mode with security issues. Fix before deploying to production!\n')
        }
    }

    if (warnings.length === 0 && errors.length === 0) {
        console.log('✅ Security configuration checks passed')
    }
}
