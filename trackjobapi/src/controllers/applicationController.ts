import { Request, Response } from 'express';
import prisma from '../prisma.js';

const applicationController = {
    // Get all applications
    getApplications: async (req: Request, res: Response) => {
        try {
            const applications = await prisma.application.findMany({
                include: {
                    user: true,
                    job: true,
                },
            });
            res.json({ success: true, data: applications });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Get single application by ID
    getApplicationById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const application = await prisma.application.findUnique({
                where: { id: parseInt(id) },
                include: {
                    user: true,
                    job: true,
                },
            });
            if (!application) {
                res.status(404).json({ success: false, error: 'Application not found' });
                return;
            }
            res.json({ success: true, data: application });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Get applications by user (Clerk user ID)
    getApplicationsByUser: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            
            const applications = await prisma.application.findMany({
                where: { userId }, // Direct Clerk user ID
                include: {
                    user: true,
                    job: true,
                },
                orderBy: { appliedDate: 'desc' },
            });
            res.json({ success: true, data: applications });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Get applications by job
    getApplicationsByJob: async (req: Request, res: Response) => {
        try {
            const { jobId } = req.params;
            const applications = await prisma.application.findMany({
                where: { jobId: parseInt(jobId) },
                include: {
                    user: true,
                    job: true,
                },
            });
            res.json({ success: true, data: applications });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Create new application (accepts either jobId or nested job data)
    createApplication: async (req: Request, res: Response) => {
        try {
            const { userId, clerkUser, jobId: bodyJobId, job: jobObj, status, appliedDate, coverLetter, resume, notes } = req.body;

            // Ensure userId is provided (Clerk user ID)
            if (!userId) {
                res.status(400).json({ success: false, error: 'userId (Clerk user ID) is required' });
                return;
            }

            // Ensure user exists in our database (upsert)
            if (clerkUser && typeof clerkUser === 'object') {
                const { email, name, avatar } = clerkUser as any;
                
                await prisma.user.upsert({
                    where: { id: userId },
                    update: {
                        name: name || null,
                        avatar: avatar || null,
                        updatedAt: null
                    },
                    create: {
                        id: userId, // Use Clerk's user ID
                        email: email ?? `user+${userId}@local`,
                        name: name || null,
                        avatar: avatar || null,
                        emailVerified: true,
                        updatedAt: null
                    }
                });
            }

            // If jobId provided, create application directly
            if (bodyJobId) {
                const application = await prisma.application.create({
                    data: {
                        userId: userId,
                        jobId: parseInt(bodyJobId),
                        status: status || 'APPLIED',
                        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
                        coverLetter: coverLetter || null,
                        resume: resume || null,
                        notes: notes || null,
                    },
                });
                const result = await prisma.application.findUnique({ where: { id: application.id }, include: { user: true, job: true } });
                res.status(201).json({ success: true, data: result });
                return;
            }

            // If nested job object provided, create job then application in a transaction
            if (jobObj && typeof jobObj === 'object') {
                const { companyname, jobtitle, joblink, comments, published, status: jobStatus } = jobObj as any;
                if (!companyname || !jobtitle) {
                    res.status(400).json({ success: false, error: 'companyname and jobtitle are required when creating a job' });
                    return;
                }

                const result = await prisma.$transaction(async (tx) => {
                    const newJob = await tx.job.create({
                        data: {
                            companyname,
                            jobtitle,
                            joblink: joblink || null,
                            comments: comments || null,
                            published: published !== undefined ? published : true,
                            status: jobStatus || status || 'APPLIED',
                            authorId: userId,
                        },
                    });

                    const application = await tx.application.create({
                        data: {
                            userId: userId,
                            jobId: newJob.id,
                            status: status || 'APPLIED',
                            appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
                            coverLetter: coverLetter || null,
                            resume: resume || null,
                            notes: notes || null,
                        },
                    });

                    return { applicationId: application.id };
                });

                const application = await prisma.application.findUnique({ where: { id: result.applicationId }, include: { user: true, job: true } });
                res.status(201).json({ success: true, data: application });
                return;
            }

            res.status(400).json({ success: false, error: 'Either jobId or job object must be provided' });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Update application
    updateApplication: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status, appliedDate, coverLetter, resume, notes, job: jobObj } = req.body;
            
            // If job object is provided, update the related job first
            if (jobObj && typeof jobObj === 'object') {
                const existingApp = await prisma.application.findUnique({
                    where: { id: parseInt(id) },
                    select: { jobId: true }
                });

                if (existingApp && existingApp.jobId) {
                    const { companyname, jobtitle, joblink, comments, published, status: jobStatus } = jobObj as any;
                    await prisma.job.update({
                        where: { id: existingApp.jobId },
                        data: {
                            ...(companyname && { companyname }),
                            ...(jobtitle && { jobtitle }),
                            ...(joblink !== undefined && { joblink }),
                            ...(comments !== undefined && { comments }),
                            ...(published !== undefined && { published }),
                            ...(jobStatus && { status: jobStatus })
                            // updatedAt is auto-managed by Prisma @updatedAt
                        }
                    });
                }
            }

            const application = await prisma.application.update({
                where: { id: parseInt(id) },
                data: {
                    ...(status && { status }),
                    ...(appliedDate && { appliedDate: new Date(appliedDate) }),
                    ...(coverLetter !== undefined && { coverLetter }),
                    ...(resume !== undefined && { resume }),
                    ...(notes !== undefined && { notes })
                    // updatedAt is auto-managed by Prisma @updatedAt
                },
                include: {
                    user: true,
                    job: true,
                }
            });
            res.json({ success: true, data: application });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Delete application
    deleteApplication: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const application = await prisma.application.delete({
                where: { id: parseInt(id) },
            });
            res.json({ success: true, message: 'Application deleted', data: application });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
};

export default applicationController;
