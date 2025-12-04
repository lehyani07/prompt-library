# Quick Setup Commands

## Run these commands in order:

# 1. Install all dependencies
npm install

# 2. Update database schema
npx prisma migrate dev --name add_security_fields

# 3. Open Prisma Studio to create admin user
npx prisma studio
# Then: Go to User table → Select a user → Change role to ADMIN → Save

# 4. Restart the dev server
# Press Ctrl+C to stop current server, then:
npm run dev

# 5. Open admin panel
# Visit: http://localhost:3000/admin
