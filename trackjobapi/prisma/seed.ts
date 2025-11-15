import prisma from '../src/prisma.js';

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data (cascade delete will handle relations)
    await prisma.application.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.note.deleteMany();
    await prisma.job.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    console.log('✓ Cleared existing data');

    // ==================== CREATE USERS ====================
    const user1 = await prisma.user.create({
        data: {
            email: 'john.doe@example.com',
            name: 'John Doe',
            password: 'hashedpassword123',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            emailVerified: true,
        },
    });
    console.log('✓ Created user:', user1.email);

    const user2 = await prisma.user.create({
        data: {
            email: 'jane.smith@example.com',
            name: 'Jane Smith',
            password: 'hashedpassword456',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            emailVerified: true,
        },
    });
    console.log('✓ Created user:', user2.email);

    const user3 = await prisma.user.create({
        data: {
            email: 'alex.johnson@example.com',
            name: 'Alex Johnson',
            provider: 'google',
            providerId: 'google_123456',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            emailVerified: true,
        },
    });
    console.log('✓ Created user:', user3.email);

    // ==================== CREATE PROFILES ====================
    await prisma.profile.create({
        data: {
            userId: user1.id,
            bio: 'Full-stack developer looking for exciting opportunities in React and Node.js',
        },
    });

    await prisma.profile.create({
        data: {
            userId: user2.id,
            bio: 'Product manager with 5+ years of experience in SaaS',
        },
    });

    await prisma.profile.create({
        data: {
            userId: user3.id,
            bio: 'UI/UX Designer passionate about creating beautiful and functional interfaces',
        },
    });
    console.log('✓ Created user profiles');

    // ==================== CREATE JOBS ====================
    const job1 = await prisma.job.create({
        data: {
            companyname: 'Tech Startup Inc',
            jobtitle: 'Senior React Developer',
            joblink: 'https://example.com/jobs/senior-react-dev',
            status: 'APPLIED',
            comments: 'Great company, modern tech stack',
            published: true,
            authorId: user1.id,
        },
    });
    console.log('✓ Created job:', job1.jobtitle);

    const job2 = await prisma.job.create({
        data: {
            companyname: 'Global Tech Company',
            jobtitle: 'Full Stack Engineer',
            joblink: 'https://example.com/jobs/fullstack-engineer',
            status: 'INTERVIEWING',
            comments: 'First round passed, waiting for technical round',
            published: true,
            authorId: user1.id,
        },
    });
    console.log('✓ Created job:', job2.jobtitle);

    const job3 = await prisma.job.create({
        data: {
            companyname: 'Design Studio',
            jobtitle: 'UX/UI Designer',
            joblink: 'https://example.com/jobs/ux-ui-designer',
            status: 'APPLIED',
            comments: 'Interesting portfolio project mentioned',
            published: true,
            authorId: user3.id,
        },
    });
    console.log('✓ Created job:', job3.jobtitle);

    const job4 = await prisma.job.create({
        data: {
            companyname: 'Finance Co',
            jobtitle: 'Product Manager',
            joblink: 'https://example.com/jobs/product-manager',
            status: 'PENDING',
            comments: 'Waiting to hear back',
            published: true,
            authorId: user2.id,
        },
    });
    console.log('✓ Created job:', job4.jobtitle);

    const job5 = await prisma.job.create({
        data: {
            companyname: 'Startup Hub',
            jobtitle: 'Frontend Developer',
            joblink: 'https://example.com/jobs/frontend-dev',
            status: 'SAVED',
            comments: 'Looks interesting, apply next week',
            published: true,
            authorId: user1.id,
        },
    });
    console.log('✓ Created job:', job5.jobtitle);

    // ==================== CREATE APPLICATIONS ====================
    const app1 = await prisma.application.create({
        data: {
            userId: user1.id,
            jobId: job1.id,
            status: 'APPLIED',
            coverLetter: 'I am excited to apply for this Senior React Developer position...',
            resume: 'John_Doe_Resume_2024.pdf',
            notes: 'Applied on November 10, 2024',
        },
    });
    console.log('✓ Created application:', `${user1.name} -> ${job1.jobtitle}`);

    const app2 = await prisma.application.create({
        data: {
            userId: user1.id,
            jobId: job2.id,
            status: 'INTERVIEWING',
            coverLetter: 'Passionate about full-stack development...',
            resume: 'John_Doe_Resume_2024.pdf',
            notes: 'Technical interview scheduled for Nov 18',
        },
    });
    console.log('✓ Created application:', `${user1.name} -> ${job2.jobtitle}`);

    const app3 = await prisma.application.create({
        data: {
            userId: user3.id,
            jobId: job3.id,
            status: 'APPLIED',
            coverLetter: 'As a UX/UX designer with passion for user-centered design...',
            resume: 'Alex_Johnson_Portfolio.pdf',
            notes: 'Portfolio shared via email',
        },
    });
    console.log('✓ Created application:', `${user3.name} -> ${job3.jobtitle}`);

    const app4 = await prisma.application.create({
        data: {
            userId: user2.id,
            jobId: job4.id,
            status: 'PENDING',
            coverLetter: 'With 5+ years in product management...',
            resume: 'Jane_Smith_Resume_2024.pdf',
            notes: 'HR said they will review and get back',
        },
    });
    console.log('✓ Created application:', `${user2.name} -> ${job4.jobtitle}`);

    // ==================== CREATE INTERVIEWS ====================
    const interview1 = await prisma.interview.create({
        data: {
            userId: user1.id,
            jobId: job2.id,
            interviewDate: new Date('2024-11-18T10:00:00'),
            interviewType: 'Video Call',
            interviewer: 'Sarah Chen - Tech Lead',
            notes: 'Prepare coding problems on React optimization',
            status: 'Scheduled',
        },
    });
    console.log('✓ Created interview:', `${user1.name} at ${job2.companyname}`);

    const interview2 = await prisma.interview.create({
        data: {
            userId: user1.id,
            jobId: job1.id,
            interviewDate: new Date('2024-11-20T14:00:00'),
            interviewType: 'In-person',
            interviewer: 'HR Team',
            notes: 'First round - Technical assessment',
            status: 'Scheduled',
        },
    });
    console.log('✓ Created interview:', `${user1.name} at ${job1.companyname}`);

    const interview3 = await prisma.interview.create({
        data: {
            userId: user3.id,
            jobId: job3.id,
            interviewDate: new Date('2024-11-25T11:00:00'),
            interviewType: 'Phone',
            interviewer: 'Design Manager',
            notes: 'Discuss design case study and design process',
            status: 'Scheduled',
        },
    });
    console.log('✓ Created interview:', `${user3.name} at ${job3.companyname}`);

    // ==================== CREATE NOTES ====================
    const note1 = await prisma.note.create({
        data: {
            userId: user1.id,
            jobId: job1.id,
            title: 'Interview Preparation - Senior React Dev',
            content: `Key topics to prepare:
- Advanced React patterns (hooks, suspense, concurrent rendering)
- State management solutions
- Performance optimization techniques
- System design for web applications
- Recent project experience with large-scale apps`,
        },
    });
    console.log('✓ Created note:', note1.title);

    const note2 = await prisma.note.create({
        data: {
            userId: user1.id,
            jobId: job2.id,
            title: 'Company Research - Global Tech Company',
            content: `Company Info:
- Founded: 2015
- Size: 500+ employees
- Tech Stack: React, Node.js, PostgreSQL, AWS
- Culture: Remote-friendly, agile methodology
- Benefits: 401k match, health insurance, learning budget`,
        },
    });
    console.log('✓ Created note:', note2.title);

    const note3 = await prisma.note.create({
        data: {
            userId: user2.id,
            jobId: null,
            title: 'Job Search Strategy 2024',
            content: `Goals:
1. Target companies in Series B-C stage
2. Focus on product management roles in SaaS
3. Apply to 5-10 positions per week
4. Follow up after 2 weeks if no response
5. Network with recruiters on LinkedIn`,
        },
    });
    console.log('✓ Created note:', note3.title);

    const note4 = await prisma.note.create({
        data: {
            userId: user3.id,
            jobId: job3.id,
            title: 'Design Portfolio Projects to Highlight',
            content: `Projects to showcase:
1. E-commerce platform redesign - increased conversion by 23%
2. Mobile app UX overhaul - improved retention by 15%
3. Design system creation - reduced dev time by 30%
4. User research case study - interview 20+ users`,
        },
    });
    console.log('✓ Created note:', note4.title);

    console.log('\n✅ Database seeded successfully!');
    console.log(`
📊 Summary:
- Users created: 3
- Jobs created: 5
- Applications created: 4
- Interviews scheduled: 3
- Notes added: 4
    `);
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
