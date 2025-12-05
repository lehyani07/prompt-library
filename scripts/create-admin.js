const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin';

    if (!email || !password) {
        console.error('Usage: node scripts/create-admin.js <email> <password> [name]');
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            name,
        },
        create: {
            email,
            name,
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Admin user created/updated successfully!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Name: ${user.name}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🔐 Role: ${user.role}`);
    console.log('\n🌐 You can now login at: http://localhost:3000/auth/signin');
    console.log('📊 Admin panel: http://localhost:3000/admin');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error:', e);
        await prisma.$disconnect();
        process.exit(1);
    });




