# Environment Variables Configuration

## Required Variables

### Database
```env
DATABASE_URL="file:./dev.db"
```

### Authentication
```env
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"
```

## Optional Variables

### Email (SMTP)
Required for password reset and email verification:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@promptlibrary.com"
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the generated password as `SMTP_PASS`

### Rate Limiting (Upstash Redis)
Optional - for production rate limiting:

```env
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

**Setup:**
1. Sign up at https://upstash.com
2. Create a Redis database
3. Copy REST URL and Token

### Analytics
Optional - for Google Analytics:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

**Setup:**
1. Create property at https://analytics.google.com
2. Get Measurement ID
3. Add to environment variables

### Admin Email
Optional - for contact form notifications:

```env
ADMIN_EMAIL="admin@promptlibrary.com"
```

## Production Variables

### Database (PostgreSQL)
For production, use PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

**Recommended Providers:**
- Vercel Postgres
- Supabase
- Railway
- Neon

### Security
```env
# Must be 32+ characters in production
NEXTAUTH_SECRET="production-secret-key-min-32-chars"
NEXTAUTH_URL="https://yourdomain.com"
```

### Email (Production)
Use professional email service:

```env
# SendGrid
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"

# Or Resend
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASS="your-resend-api-key"
```

## Environment Files

### `.env.local` (Development)
```env
# Local development only
# Not committed to git
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="dev-secret"
NEXTAUTH_URL="http://localhost:3001"
```

### `.env.production` (Production)
```env
# Production environment
# Set in hosting platform (Vercel, Railway, etc.)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="production-secret-32-chars-min"
NEXTAUTH_URL="https://yourdomain.com"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-api-key"
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong secrets** - Minimum 32 characters
3. **Rotate secrets regularly** - Change every 90 days
4. **Use different secrets** - Dev vs Production
5. **Limit access** - Only necessary team members
6. **Use secret managers** - For production (AWS Secrets Manager, etc.)

## Verification

Check if all required variables are set:

```bash
# Development
npm run dev

# Production
npm run build
```

If any required variables are missing, you'll see errors in the console.

## Troubleshooting

### "NEXTAUTH_SECRET is too short"
- Generate new secret: `openssl rand -base64 32`
- Must be at least 32 characters

### "Failed to send email"
- Check SMTP credentials
- Verify SMTP_PORT (usually 587 or 465)
- Test with Gmail first
- Check firewall/network settings

### "Database connection failed"
- Verify DATABASE_URL format
- Check database is running
- Ensure network access
- Run `npx prisma db push`

### "Rate limiting not working"
- UPSTASH variables are optional
- Rate limiting is disabled without them
- Only needed for production

## Next Steps

After configuration:

1. Run database migrations: `npx prisma db push`
2. Generate Prisma client: `npx prisma generate`
3. Create admin user: `npm run create-admin`
4. Start development: `npm run dev`
