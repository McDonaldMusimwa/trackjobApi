import prisma from '../prisma.js';
const applicationController = {
    // Get all applications
    getApplications: async (req, res) => {
        try {
            const applications = await prisma.application.findMany({
                include: {
                    user: true,
                    job: true,
                },
            });
            res.json({ success: true, data: applications });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Get single application by ID
    getApplicationById: async (req, res) => {
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
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Get applications by user
    getApplicationsByUser: async (req, res) => {
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
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Get applications by job
    getApplicationsByJob: async (req, res) => {
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
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Create new application
    createApplication: async (req, res) => {
        try {
            const { userId, jobId, status, coverLetter, resume, notes } = req.body;
            if (!userId || !jobId) {
                res.status(400).json({ success: false, error: 'User ID and Job ID are required' });
                return;
            }
            const application = await prisma.application.create({
                data: {
                    userId: parseInt(userId),
                    jobId: parseInt(jobId),
                    status: status || 'APPLIED',
                    coverLetter: coverLetter || null,
                    resume: resume || null,
                    notes: notes || null,
                },
            });
            res.status(201).json({ success: true, data: application });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Update application
    updateApplication: async (req, res) => {
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
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Delete application
    deleteApplication: async (req, res) => {
        try {
            const { id } = req.params;
            const application = await prisma.application.delete({
                where: { id: parseInt(id) },
            });
            res.json({ success: true, message: 'Application deleted', data: application });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
};
export default applicationController;
