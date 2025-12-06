# Deployment Guide - Prompt Library

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (for production)
- SMTP credentials (for emails)
- Domain name (optional)

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository
```bash
# Initialize git if not already
git init
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git remote add origin https://github.com/yourusername/prompt-library.git
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Step 3: Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:

```env
# Database (Vercel Postgres)
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-production-secret-32-chars-min
NEXTAUTH_URL=https://yourdomain.com

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Rate Limiting (Optional)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

#### Step 4: Database Setup
```bash
# Install Vercel Postgres
vercel postgres create

# Run migrations
npx prisma db push
npx prisma generate

# Create admin user
npm run create-admin
```

#### Step 5: Deploy
```bash
vercel --prod
```

---

### Option 2: Railway

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

#### Step 2: Initialize Project
```bash
railway init
railway link
```

#### Step 3: Add PostgreSQL
```bash
railway add postgresql
```

#### Step 4: Set Environment Variables
```bash
railway variables set NEXTAUTH_SECRET=your-secret
railway variables set NEXTAUTH_URL=https://yourdomain.railway.app
# Add other variables...
```

#### Step 5: Deploy
```bash
railway up
```

---

### Option 3: DigitalOcean App Platform

#### Step 1: Create App
1. Go to [DigitalOcean](https://cloud.digitalocean.com)
2. Apps → Create App
3. Connect GitHub repository

#### Step 2: Configure
- Type: Web Service
- Build Command: `npm run build`
- Run Command: `npm start`
- HTTP Port: 3000

#### Step 3: Add Database
- Create PostgreSQL database
- Link to app
- Copy DATABASE_URL

#### Step 4: Environment Variables
Add in App Settings → Environment Variables

#### Step 5: Deploy
Click "Deploy"

---

## 📊 Database Migration

### From SQLite to PostgreSQL

#### Step 1: Export Data
```bash
# Backup current data
npx prisma db pull
npx prisma generate
```

#### Step 2: Update DATABASE_URL
```env
# Old (SQLite)
DATABASE_URL="file:./dev.db"

# New (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database"
```

#### Step 3: Migrate Schema
```bash
# Push schema to PostgreSQL
npx prisma db push

# Generate client
npx prisma generate
```

#### Step 4: Migrate Data (if needed)
```bash
# Use Prisma Studio to export/import
npx prisma studio
```

---

## 🔐 Security Checklist

### Before Deployment

- [ ] Change NEXTAUTH_SECRET (32+ characters)
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Use strong database password
- [ ] Enable SSL for database connection
- [ ] Set up CORS properly
- [ ] Review SECURITY.md
- [ ] Enable rate limiting (Upstash)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CSP headers
- [ ] Enable HTTPS only

### After Deployment

- [ ] Test all authentication flows
- [ ] Verify email sending works
- [ ] Test password reset
- [ ] Check rate limiting
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure backups
- [ ] Test dark mode
- [ ] Verify SEO (sitemap, robots)
- [ ] Submit sitemap to Google

---

## 🌐 Domain Configuration

### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48h)
5. SSL certificate auto-generated

### Custom Domain on Railway

1. Settings → Domains
2. Add custom domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: @
   Value: your-app.up.railway.app
   ```

---

## 📧 Email Configuration

### SendGrid Setup

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API Key
3. Verify sender email
4. Add to environment:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-api-key
   ```

### Resend Setup (Alternative)

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Configure:
   ```env
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=your-api-key
   ```

---

## 📈 Post-Deployment

### Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property
3. Verify ownership (HTML tag method)
4. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### Google Analytics

1. Create property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID
3. Add to environment variables
4. Verify tracking in Real-Time reports

### Performance Monitoring

1. Set up Vercel Analytics (automatic)
2. Or use Lighthouse CI
3. Monitor Core Web Vitals
4. Set up alerts for downtime

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Check DATABASE_URL format
# PostgreSQL: postgresql://user:pass@host:5432/db
```

### Email Not Sending

1. Check SMTP credentials
2. Verify sender email
3. Check firewall rules
4. Test with Gmail first
5. Review error logs

### Rate Limiting Not Working

1. Verify Upstash credentials
2. Check Redis connection
3. Falls back to in-memory if missing

---

## 📊 Monitoring

### Recommended Tools

- **Uptime**: UptimeRobot, Pingdom
- **Errors**: Sentry, LogRocket
- **Performance**: Vercel Analytics, Lighthouse
- **Analytics**: Google Analytics, Plausible

### Set Up Alerts

1. Downtime alerts (email/SMS)
2. Error rate threshold
3. Performance degradation
4. Database connection issues

---

## 🔄 Updates & Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Backup database weekly
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Test critical flows
- [ ] Review performance metrics

### Update Process

```bash
# Update dependencies
npm update
npm audit fix

# Test locally
npm run dev
npm run build

# Deploy
git add .
git commit -m "Update dependencies"
git push
```

---

## 📞 Support

### Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://prisma.io/docs

### Common Issues

Check `/docs` folder for:
- ENVIRONMENT_SETUP.md
- ANALYTICS_SETUP.md
- IMAGE_OPTIMIZATION.md
- IMPLEMENTATION_SUMMARY.md

---

**Last Updated:** December 6, 2025
**Status:** ✅ Production Ready
