
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const messages = [
        // Suggestions
        {
            name: "Ahmed Hassan",
            email: "ahmed.h@example.com",
            message: "It would be great if we could categorize favorites into folders.",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
            name: "Sarah Miller",
            email: "sarah.m@example.com",
            message: "Please add a dark mode toggle to the footer.",
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        },

        // Complaints
        {
            name: "Angry User",
            email: "complaints@internet.com",
            message: "The search function is sometimes slow on mobile devices.",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
        },
        {
            name: "Bug Hunter",
            email: "bugs@finder.com",
            message: "I found a typo on the 'About Us' page.",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
        },

        // Thanks
        {
            name: "Fatima Al-Sayed",
            email: "fatima@domain.com",
            message: "Thank you for this amazing resource! It really helps with my daily work.",
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
        },
        {
            name: "John Doe",
            email: "john.doe@gmail.com",
            message: "Just wanted to say thanks for the quick support response yesterday.",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
        },

        // General
        {
            name: "Marketing Team",
            email: "contact@partner.com",
            message: "We are interested in a potential partnership. Who should we contact?",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
        },
        {
            name: "New Visitor",
            email: "visitor@web.com",
            message: "Is there an API available for these prompts?",
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
        },
        {
            name: "Content Creator",
            email: "creator@youtube.com",
            message: "Can I use these prompts in my videos if I credit you?",
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
        },
        {
            name: "System Admin",
            email: "sysadmin@local.com",
            message: "Testing the contact form functionality.",
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 1 week ago
        }
    ]

    console.log('Start seeding contact messages...')

    for (const msg of messages) {
        await prisma.contactMessage.create({
            data: msg
        })
    }

    console.log('Added 10 contact messages')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
