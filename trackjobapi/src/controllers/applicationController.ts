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

    // Get applications by user
    getApplicationsByUser: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const applications = await prisma.application.findMany({
                where: { userId: parseInt(userId) },
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
            const { userId: bodyUserId, clerkUser, jobId: bodyJobId, job: jobObj, status, coverLetter, resume, notes } = req.body;

            // determine userId: prefer numeric body userId
            let userId: number | null = bodyUserId ? parseInt(bodyUserId) : null;

            // If clerkUser info provided (from frontend), try to find existing user by provider/providerId or create one
            if (!userId && clerkUser && typeof clerkUser === 'object') {
                const { provider = 'clerk', providerId, email, name, avatar } = clerkUser as any;
                if (providerId) {
                    let found = await prisma.user.findFirst({ where: { provider: provider, providerId: providerId } });
                    if (!found && email) {
                        // also try find by email if provider match not found
                        found = await prisma.user.findUnique({ where: { email } });
                    }
                    if (!found) {
                        const created = await prisma.user.create({ data: { email: email ?? `user+${providerId}@local`, name: name ?? null, provider, providerId, avatar: avatar ?? null, emailVerified: true } });
                        userId = created.id;
                    } else {
                        userId = found.id;
                    }
                }
            }

            // determine fallback to first user only if still not found
            if (!userId) {
                const firstUser = await prisma.user.findFirst();
                if (!firstUser) {
                    res.status(400).json({ success: false, error: 'No user found; provide userId or clerkUser' });
                    return;
                }
                userId = firstUser.id;
            }

            // If jobId provided, create application directly
            if (bodyJobId) {
                const application = await prisma.application.create({
                    data: {
                        userId: userId,
                        jobId: parseInt(bodyJobId),
                        status: status || 'APPLIED',
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
                const { companyname, jobtitle, joblink, comments, published } = jobObj as any;
                if (!companyname || !jobtitle || !joblink) {
                    res.status(400).json({ success: false, error: 'companyname, jobtitle and joblink are required when creating a job' });
                    return;
                }

                const result = await prisma.$transaction(async (tx) => {
                    const newJob = await tx.job.create({
                        data: {
                            companyname,
                            jobtitle,
                            joblink,
                            comments: comments || null,
                            published: published || false,
                            authorId: userId,
                        },
                    });

                    const application = await tx.application.create({
                        data: {
                            userId: userId,
                            jobId: newJob.id,
                            status: status || 'APPLIED',
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
            const { status, coverLetter, resume, notes } = req.body;
            const application = await prisma.application.update({
                where: { id: parseInt(id) },
                data: {
                    ...(status && { status }),
                    ...(coverLetter && { coverLetter }),
                    ...(resume && { resume }),
                    ...(notes && { notes }),
                    updatedAt: new Date(),
                },
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
