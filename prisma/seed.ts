import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create an admin user (or ensure it exists)
    const adminEmail = 'admin@example.com';
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin',
            password: 'securepassword', // In real app, hash this!
        },
    });

    // Define categories
    const categories = [
        { name: 'Creative Writing', slug: 'creative-writing', description: 'Prompts for stories, poems, and scripts' },
        { name: 'Coding', slug: 'coding', description: 'Programming and software development prompts' },
        { name: 'Business', slug: 'business', description: 'Professional and business-related prompts' },
        { name: 'Education', slug: 'education', description: 'Learning and teaching prompts' },
        { name: 'Art & Design', slug: 'art-design', description: 'Image generation and design prompts' },
        { name: 'Productivity', slug: 'productivity', description: 'Prompts to help you get things done' },
    ];

    console.log('Seeding categories...');
    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });
        console.log(`Category created: ${category.name}`);
    }

    // Define prompts for each category (60 total, 10 per category)
    const prompts = [
        // Creative Writing (10 prompts)
        { title: 'Mystery Story Starter', description: 'Create an opening scene for a mystery novel', content: 'Write an engaging opening scene for a mystery novel set in a small coastal town. Introduce a protagonist detective and a central conflict that will hook readers.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'Character Profile Generator', description: 'Develop detailed character profiles', content: 'Generate a detailed character profile for a protagonist in a noir-style mystery novel. Include physical appearance, personality traits, background, motivations, and internal conflicts.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'Plot Twist Creator', description: 'Generate innovative plot twists', content: 'Propose three innovative plot twists for a thriller novel about a journalist uncovering a government conspiracy. Make each twist unexpected yet logical within the story.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'Dialogue Writing Coach', description: 'Craft realistic character dialogue', content: 'Write a tense dialogue between two characters who are former friends now on opposite sides of a conflict. Ensure each character has a distinct voice and personality.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'World-Building Assistant', description: 'Create immersive fictional worlds', content: 'Build a unique fantasy world by describing its geography, cultures, political systems, and magical elements. Include details about the world\'s history and current conflicts.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'Poetry Inspiration', description: 'Generate poetry prompts and themes', content: 'Compose a poem that captures the emotions and imagery of a sunrise over the ocean. Use sensory details and metaphors to create vivid imagery.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'Story Arc Developer', description: 'Structure compelling story arcs', content: 'Create a detailed three-act structure for a novel about personal redemption, focusing on character growth, key plot points, and emotional turning points.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'Scene Description Master', description: 'Write vivid scene descriptions', content: 'Describe a bustling marketplace in a medieval fantasy city. Include sensory details (sights, sounds, smells), character actions, and atmospheric elements that bring the scene to life.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'Genre Fusion Creator', description: 'Combine genres for unique stories', content: 'Create a story concept that blends science fiction with romance. Describe the premise, main characters, setting, and the central conflict that drives the plot.', categorySlug: 'creative-writing', isPublic: true },
        { title: 'Flash Fiction Challenge', description: 'Write complete micro-stories', content: 'Write a complete 500-word story using the hero\'s journey structure. Include a clear beginning, middle, and end with character transformation.', categorySlug: 'creative-writing', isPublic: true },

        // Coding (10 prompts)
        { title: 'Code Debugger', description: 'Identify and fix code errors', content: 'Act as an expert debugger. I\'m seeing this error in my JavaScript code: [paste error message]. Explain what it means, suggest three possible causes, and provide a corrected version of the code.', categorySlug: 'coding', isPublic: true },
        { title: 'Algorithm Optimizer', description: 'Optimize code for better performance', content: 'Review this sorting algorithm and suggest optimizations to achieve O(n log n) time complexity. Explain why the optimized version is better and any trade-offs involved.', categorySlug: 'coding', isPublic: true },
        { title: 'React Component Builder', description: 'Generate React components', content: 'Write a functional React component for a modal dialog with TypeScript. Include proper prop types, accessibility features, and smooth animations.', categorySlug: 'coding', isPublic: true },
        { title: 'Code Documentation Writer', description: 'Generate clear code documentation', content: 'Generate comprehensive docstrings for the following Python function. Include a brief description, parameters with types, return values, and example usage.', categorySlug: 'coding', isPublic: true },
        { title: 'API Endpoint Creator', description: 'Build RESTful API endpoints', content: 'Generate a Node.js Express server setup with CRUD routes for managing user data. Include error handling, validation, and best practices for security.', categorySlug: 'coding', isPublic: true },
        { title: 'Code Reviewer', description: 'Review code for quality and security', content: 'Act as a senior developer reviewing this code. Analyze it for: code quality, potential bugs, performance optimizations, security vulnerabilities, and best practices. Provide specific suggestions.', categorySlug: 'coding', isPublic: true },
        { title: 'Refactoring Assistant', description: 'Improve code structure and readability', content: 'Refactor this code to improve readability and maintainability while preserving functionality. Apply SOLID principles, use descriptive names, and add helpful comments.', categorySlug: 'coding', isPublic: true },
        { title: 'Database Query Optimizer', description: 'Write efficient database queries', content: 'Write an optimized SQL query to retrieve user data with their related orders and products. Ensure proper joins, indexing suggestions, and explain the query execution plan.', categorySlug: 'coding', isPublic: true },
        { title: 'Unit Test Generator', description: 'Create comprehensive unit tests', content: 'Generate unit tests for this function using Jest. Cover edge cases, error scenarios, and normal operation. Include setup, assertions, and teardown as needed.', categorySlug: 'coding', isPublic: true },
        { title: 'Code Explainer', description: 'Explain complex code in simple terms', content: 'Explain this complex algorithm line by line in plain language. Break down its purpose, how it works, time/space complexity, and any non-obvious aspects.', categorySlug: 'coding', isPublic: true },

        // Business (10 prompts)
        { title: 'Elevator Pitch Creator', description: 'Craft compelling 30-second pitches', content: 'Create a compelling 30-second elevator pitch for a SaaS startup that helps small businesses automate their accounting. Focus on the problem, solution, and unique value proposition.', categorySlug: 'business', isPublic: true },
        { title: 'Content Strategy Planner', description: 'Develop comprehensive content strategies', content: 'Create a 3-month content strategy for a B2B software company targeting CTOs. Include content pillars, distribution channels, topics, and success metrics.', categorySlug: 'business', isPublic: true },
        { title: 'Email Campaign Writer', description: 'Write high-converting email copy', content: 'Draft a compelling email sequence (5 emails) for nurturing leads who downloaded our marketing ebook. Include subject lines, body copy, and clear CTAs for each email.', categorySlug: 'business', isPublic: true },
        { title: 'Social Media Post Generator', description: 'Create engaging social content', content: 'Generate 10 LinkedIn posts that highlight the benefits of our project management software for remote teams. Make them engaging, authentic, and include relevant hashtags.', categorySlug: 'business', isPublic: true },
        { title: 'Landing Page Copywriter', description: 'Write high-converting landing pages', content: 'Write compelling copy for a landing page promoting our new AI writing tool. Include a headline, subheadings, benefit bullets, social proof, and a strong CTA that drives sign-ups.', categorySlug: 'business', isPublic: true },
        { title: 'Ad Copy Specialist', description: 'Create effective ad campaigns', content: 'Write 5 Google Ads headlines and descriptions for a local dental practice. Target keywords like "teeth whitening" and "family dentist". Include urgency and clear benefits.', categorySlug: 'business', isPublic: true },
        { title: 'Customer Persona Builder', description: 'Develop detailed customer profiles', content: 'Create 3 detailed customer personas for an e-commerce fitness brand. Include demographics, goals, pain points, buying behaviors, and preferred communication channels.', categorySlug: 'business', isPublic: true },
        { title: 'Product Description Writer', description: 'Write compelling product copy', content: 'Write a 200-word product description for eco-friendly hiking backpacks. Highlight durability, sustainability, features, and benefits. Use an aspirational yet practical tone.', categorySlug: 'business', isPublic: true },
        { title: 'Business Plan Generator', description: 'Create structured business plans', content: 'Generate an executive summary for a business plan for a mobile app that connects freelance designers with small businesses. Include market opportunity, solution, and financial projections.', categorySlug: 'business', isPublic: true },
        { title: 'Learning Objective Writer', description: 'Write clear learning objectives', content: 'Write specific, measurable learning objectives for a unit on cellular biology for 10th grade students. Use Bloom\'s taxonomy to ensure varied cognitive levels.', categorySlug: 'education', isPublic: true },

        // Productivity (10 prompts)
        { title: 'Weekly Planner', description: 'Create strategic weekly plans', content: 'Act as an executive assistant. My main goal this week is to complete the Q4 marketing report. I have meetings on Monday at 10 AM and Thursday at 3 PM. Create a strategic weekly plan with daily action items.', categorySlug: 'productivity', isPublic: true },
        { title: 'Task Prioritizer', description: 'Organize tasks by importance', content: 'Here\'s my task list: [paste your tasks]. Categorize each using the Eisenhower Matrix (Urgent/Important, Not Urgent/Important, etc.) and suggest what to delegate or eliminate.', categorySlug: 'productivity', isPublic: true },
        { title: 'Meeting Agenda Generator', description: 'Create effective meeting agendas', content: 'Generate a meeting agenda for a 60-minute product planning session with the development team. Include time allocations, discussion points, decision items, and space for action items.', categorySlug: 'productivity', isPublic: true },
        { title: 'Email Template Writer', description: 'Draft professional emails quickly', content: 'Write a professional email to my manager requesting a deadline extension for the client presentation. Be courteous, explain the reason clearly, and suggest a new timeline.', categorySlug: 'productivity', isPublic: true },
        { title: 'Project Breakdown Helper', description: 'Break large projects into steps', content: 'Break down the project "Launch new company website" into major work items, sub-tasks, and specific actions. Number each action in hierarchical format (1.1.1, 1.1.2, etc.).', categorySlug: 'productivity', isPublic: true },
        { title: 'Time Blocking Optimizer', description: 'Create focused work schedules', content: 'I work 9 AM to 5 PM and need to write a 3000-word article this week. Block out specific 90-minute deep work sessions at times when I have the most energy, and fill remaining time with lighter tasks.', categorySlug: 'productivity', isPublic: true },
        { title: 'Action Item Extractor', description: 'Pull tasks from meeting notes', content: 'Read this meeting transcript and create a bulleted list of all actionable items. Include the responsible person and deadline for each task if mentioned.', categorySlug: 'productivity', isPublic: true },
        { title: 'SMART Goal Creator', description: 'Set achievable, measurable goals', content: 'Help me create SMART goals for increasing website traffic by 25% over the next quarter. Include specific metrics, milestones, and action steps to track progress.', categorySlug: 'productivity', isPublic: true },
        { title: 'Daily Summary Generator', description: 'Create end-of-day summaries', content: 'Generate a brief daily summary template that captures: key accomplishments, challenges faced, lessons learned, and top 3 priorities for tomorrow. Keep it under 200 words.', categorySlug: 'productivity', isPublic: true },
        { title: 'Focus Session Planner', description: 'Plan distraction-free work sessions', content: 'Create a Pomodoro-style work plan for completing my tax preparation. Break it into 25-minute focused sessions with specific tasks for each session and short break activities.', categorySlug: 'productivity', isPublic: true },

        // Art & Design (10 prompts)
        { title: 'Logo Concept Generator', description: 'Create logo design concepts', content: 'Design 3 modern logo concepts for a tech startup called "CloudSync" that makes cloud storage software. Describe the design elements, color schemes, and symbolism for each concept.', categorySlug: 'art-design', isPublic: true },
        { title: 'Image Generation Prompt', description: 'Create detailed image generation prompts', content: 'Create a detailed prompt for AI image generation: A futuristic cityscape at night with neon lights and flying cars, cyberpunk style, cinematic lighting, 8k resolution, wide shot from elevated perspective.', categorySlug: 'art-design', isPublic: true },
        { title: 'Color Palette Creator', description: 'Generate harmonious color schemes', content: 'Generate a color palette for a wellness brand website. Include 5 colors (primary, secondary, accent, neutral, and background) with hex codes and usage recommendations for each.', categorySlug: 'art-design', isPublic: true },
        { title: 'Character Design Brief', description: 'Develop character concepts', content: 'Create a character design brief for a fantasy RPG protagonist. Include physical appearance, clothing, personality traits, backstory elements, and distinctive visual features.', categorySlug: 'art-design', isPublic: true },
        { title: 'UI Design System', description: 'Create design system guidelines', content: 'Create a basic design system for a mobile fitness app. Include typography choices, color palette, button styles, spacing guidelines, and icon style recommendations.', categorySlug: 'art-design', isPublic: true },
        { title: 'Illustration Style Guide', description: 'Define illustration aesthetics', content: 'Define an illustration style for a children\'s book about space exploration. Describe the art style (realistic/cartoon), color approach, level of detail, and mood/atmosphere.', categorySlug: 'art-design', isPublic: true },
        { title: 'Scene Composition Helper', description: 'Plan visual compositions', content: 'Describe the composition for a dramatic hero shot of a knight standing ona cliff at sunset. Include camera angle, lighting direction, rule of thirds application, and focal points.', categorySlug: 'art-design', isPublic: true },
        { title: 'Mood Board Creator', description: 'Develop visual inspiration boards', content: 'Create a mood board concept for a luxury hotel brand redesign. Describe 8-10 visual elements including photography style, textures, color themes, and typography examples.', categorySlug: 'art-design', isPublic: true },
        { title: 'Icon Set Designer', description: 'Design cohesive icon sets', content: 'Design a set of 10 icons for a productivity app (tasks, calendar, notes, etc.). Describe the style (line art, filled, flat), size, stroke weight, and how to maintain visual consistency.', categorySlug: 'art-design', isPublic: true },
        { title: 'Artistic Style Mixer', description: 'Combine artistic styles creatively', content: 'Describe an artwork that blends Art Nouveau aesthetics with cyberpunk elements. Include details about composition, color palette, key visual elements, and how the two styles merge.', categorySlug: 'art-design', isPublic: true },
    ];

    console.log('Seeding prompts...');
    for (const prompt of prompts) {
        const cat = await prisma.category.findUnique({ where: { slug: prompt.categorySlug } });
        if (!cat) continue;
        await prisma.prompt.create({
            data: {
                title: prompt.title,
                description: prompt.description,
                content: prompt.content,
                categoryId: cat.id,
                authorId: adminUser.id,
                isPublic: prompt.isPublic,
            },
        });
        console.log(`Prompt created: ${prompt.title}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
