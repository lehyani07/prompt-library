import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting to seed test users...')

    const testUsers = [
        {
            name: 'أحمد محمد',
            email: 'ahmed@test.com',
            password: 'password123'
        },
        {
            name: 'فاطمة علي',
            email: 'fatima@test.com',
            password: 'password123'
        },
        {
            name: 'محمد خالد',
            email: 'mohammed@test.com',
            password: 'password123'
        },
        {
            name: 'سارة أحمد',
            email: 'sara@test.com',
            password: 'password123'
        },
        {
            name: 'علي حسن',
            email: 'ali@test.com',
            password: 'password123'
        }
    ]

    for (const userData of testUsers) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email }
        })

        if (existingUser) {
            console.log(`⏭️  User ${userData.email} already exists, skipping...`)
            continue
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: 'USER',
                status: 'ACTIVE'
            }
        })

        console.log(`✅ Created user: ${user.name} (${user.email})`)
    }

    console.log('\n📊 Summary:')
    const totalUsers = await prisma.user.count()
    console.log(`Total users in database: ${totalUsers}`)

    console.log('\n🔑 Test User Credentials:')
    console.log('━'.repeat(50))
    testUsers.forEach(user => {
        console.log(`Email: ${user.email}`)
        console.log(`Password: ${user.password}`)
        console.log(`Name: ${user.name}`)
        console.log('━'.repeat(50))
    })

    console.log('\n✨ Seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding users:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
