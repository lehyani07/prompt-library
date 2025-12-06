# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing the maintainers. Please do not open a public issue.

## Security Best Practices

### 1. Environment Variables
- **Never commit `.env` files** to version control
- Always use strong, randomly generated values for `NEXTAUTH_SECRET`
- Generate secure secrets using: `openssl rand -base64 32`
- Keep production secrets separate from development

### 2. Authentication & Authorization
- JWT sessions expire after 30 days
- Session tokens refresh every 24 hours
- Secure cookies are enforced in production
- Role-based access control (RBAC) is implemented for admin features

### 3. Input Validation
- All user inputs are validated using Zod schemas
- Maximum length limits are enforced on all text fields
- Email validation follows RFC standards
- Password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

### 4. Rate Limiting
- 10 requests per 10 seconds per IP address
- Applied to all state-changing endpoints (POST, PUT, DELETE, PATCH)
- Prevents brute force attacks and spam

### 5. CSRF Protection
- Middleware validates Origin header
- All state-changing requests require same-origin

### 6. SQL Injection Protection
- Prisma ORM uses parameterized queries exclusively
- No raw SQL queries are executed

### 7. XSS Protection
- React auto-escapes all user content
- Content Security Policy (CSP) headers are set
- No use of `dangerouslySetInnerHTML` in custom code

### 8. Security Headers
The following security headers are automatically set:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser features
- `Content-Security-Policy` - Prevents XSS attacks

## Deployment Checklist

Before deploying to production:

- [ ] Generate a strong `NEXTAUTH_SECRET` (minimum 32 characters)
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Configure Upstash Redis for rate limiting
- [ ] Enable SMTP for email verification
- [ ] Review and update CORS settings if needed
- [ ] Ensure HTTPS is enabled
- [ ] Review all environment variables
- [ ] Test authentication flows
- [ ] Verify rate limiting is working
- [ ] Check security headers in browser DevTools

## Security Features

### Built-in Protections
✅ SQL Injection - Protected via Prisma ORM  
✅ XSS - Protected via React + CSP  
✅ CSRF - Protected via middleware  
✅ Brute Force - Protected via rate limiting  
✅ Session Fixation - Protected via secure session config  
✅ Clickjacking - Protected via X-Frame-Options  

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- Never stored in plain text
- Never logged or exposed in API responses
- Strong password requirements enforced

### Data Protection
- Sensitive data excluded from API responses
- User passwords never returned in queries
- Email verification tokens expire after 24 hours
- Failed login attempts are logged (future: account lockout)

## Updates and Maintenance

- Keep dependencies updated regularly
- Monitor security advisories for Next.js and dependencies
- Review and update security policies periodically
- Audit logs for suspicious activity

## Contact

For security concerns, please contact the project maintainers.

---

**Last Updated:** December 2025
