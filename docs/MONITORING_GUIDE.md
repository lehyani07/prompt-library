# Monitoring & Maintenance Guide

## Health Check Endpoint

### URL
```
GET /api/health
```

### Response
```json
{
  "timestamp": "2025-12-06T06:24:00.000Z",
  "status": "healthy",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": "15ms"
    },
    "data": {
      "users": 150,
      "prompts": 1250
    },
    "memory": {
      "heapUsed": "45MB",
      "heapTotal": "128MB",
      "rss": "180MB"
    },
    "environment": {
      "nodeVersion": "v18.17.0",
      "platform": "linux",
      "uptime": "3600s"
    }
  }
}
```

### Usage

**Manual Check:**
```bash
curl https://yourdomain.com/api/health
```

**Uptime Monitoring:**
Configure your monitoring service (UptimeRobot, Pingdom, etc.) to check this endpoint every 5 minutes.

---

## Database Backups

### Automated Backup Script

**Location:** `scripts/backup-database.js`

### Usage

**Manual Backup:**
```bash
node scripts/backup-database.js
```

**Scheduled Backup (Cron):**
```bash
# Daily at 2 AM
0 2 * * * cd /path/to/project && node scripts/backup-database.js

# Every 6 hours
0 */6 * * * cd /path/to/project && node scripts/backup-database.js
```

**Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (daily at 2 AM)
4. Action: Start a program
5. Program: `node`
6. Arguments: `scripts/backup-database.js`
7. Start in: `F:\antigravity\rompt library`

### Backup Features
- ✅ Automatic timestamped backups
- ✅ Supports SQLite & PostgreSQL
- ✅ Auto-cleanup (keeps last 7 days)
- ✅ File size reporting
- ✅ Error handling

### Restore from Backup

**SQLite:**
```bash
cp backups/backup-2025-12-06.db prisma/dev.db
```

**PostgreSQL:**
```bash
pg_restore -h localhost -U username -d database_name backups/backup-2025-12-06.sql
```

---

## Error Monitoring (Sentry)

### Setup

1. **Install Sentry:**
```bash
npm install @sentry/nextjs
```

2. **Initialize:**
```bash
npx @sentry/wizard@latest -i nextjs
```

3. **Configure `.env.local`:**
```env
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

4. **Usage:**
```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // Your code
} catch (error) {
  Sentry.captureException(error)
  throw error
}
```

### Features
- Real-time error tracking
- Stack traces
- User context
- Performance monitoring
- Release tracking

---

## Performance Monitoring

### Vercel Analytics

**Enable in Vercel Dashboard:**
1. Project Settings → Analytics
2. Enable Web Analytics
3. Enable Speed Insights

**Add to Layout:**
```tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Lighthouse CI

**Install:**
```bash
npm install -g @lhci/cli
```

**Configure `.lighthouserc.js`:**
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
}
```

**Run:**
```bash
lhci autorun
```

---

## Uptime Monitoring

### UptimeRobot (Free)

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add New Monitor
3. Monitor Type: HTTP(s)
4. URL: `https://yourdomain.com/api/health`
5. Monitoring Interval: 5 minutes
6. Alert Contacts: Your email

### Pingdom

1. Sign up at [pingdom.com](https://pingdom.com)
2. Add New Check
3. Check Type: HTTP
4. URL: `https://yourdomain.com/api/health`
5. Check Interval: 1 minute

---

## Log Management

### Vercel Logs

**View Logs:**
```bash
vercel logs [deployment-url]
```

**Real-time Logs:**
```bash
vercel logs --follow
```

### Log Aggregation (LogRocket)

**Install:**
```bash
npm install logrocket
```

**Setup:**
```typescript
import LogRocket from 'logrocket'

if (process.env.NODE_ENV === 'production') {
  LogRocket.init('your-app-id')
}
```

---

## Maintenance Tasks

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review analytics

### Weekly
- [ ] Database backup verification
- [ ] Performance review
- [ ] Security updates check

### Monthly
- [ ] Dependency updates
- [ ] Security audit
- [ ] Backup restore test
- [ ] Performance optimization

---

## Alerts & Notifications

### Email Alerts

Configure in your monitoring service:
- Downtime alerts
- Error rate threshold (>5%)
- Response time threshold (>2s)
- Database connection issues

### Slack Integration

**UptimeRobot → Slack:**
1. UptimeRobot → Alert Contacts
2. Add Slack webhook
3. Configure notifications

**Sentry → Slack:**
1. Sentry → Settings → Integrations
2. Add Slack
3. Configure alert rules

---

## Troubleshooting

### High Memory Usage
```bash
# Check memory
node --max-old-space-size=4096 server.js

# Monitor
npm install -g clinic
clinic doctor -- node server.js
```

### Slow Database Queries
```bash
# Enable query logging
npx prisma studio

# Analyze slow queries
EXPLAIN ANALYZE SELECT ...
```

### High Error Rate
1. Check Sentry dashboard
2. Review error logs
3. Check recent deployments
4. Rollback if needed

---

## Best Practices

1. **Monitor Everything**
   - Uptime
   - Performance
   - Errors
   - Database

2. **Automate Backups**
   - Daily backups
   - Test restores
   - Off-site storage

3. **Set Up Alerts**
   - Email notifications
   - Slack integration
   - SMS for critical issues

4. **Regular Maintenance**
   - Update dependencies
   - Security patches
   - Performance optimization

5. **Document Issues**
   - Keep incident log
   - Post-mortem analysis
   - Preventive measures

---

## Resources

- [Vercel Monitoring](https://vercel.com/docs/analytics)
- [Sentry Docs](https://docs.sentry.io)
- [UptimeRobot](https://uptimerobot.com)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Last Updated:** December 6, 2025
