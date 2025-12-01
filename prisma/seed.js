const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    // Create Categories
    const categories = [
        { name: 'Creative Writing', slug: 'creative-writing', description: 'Prompts for stories, poems, and scripts' },
        { name: 'Coding', slug: 'coding', description: 'Programming and software development prompts' },
        { name: 'Business', slug: 'business', description: 'Professional and business-related prompts' },
        { name: 'Education', slug: 'education', description: 'Learning and teaching prompts' },
        { name: 'Art & Design', slug: 'art-design', description: 'Image generation and design prompts' },
        { name: 'Productivity', slug: 'productivity', description: 'Prompts to help you get things done' },
        { name: 'Marketing', slug: 'marketing', description: 'Copywriting and marketing strategy prompts' },
        { name: 'Fun', slug: 'fun', description: 'Just for fun and entertainment' },
    ]

    console.log('Start seeding categories...')

    for (const category of categories) {
        const cat = await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        })
        console.log(`Upserted category: ${cat.name}`)
    }

    // Create Demo User
    console.log('Creating demo user...')
    const hashedPassword = await bcrypt.hash('password123', 10)

    const user = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            name: 'Demo User',
            password: hashedPassword,
        },
    })

    console.log(`Created user: ${user.email}`)

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
