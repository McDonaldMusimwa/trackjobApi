import prisma from '../prisma.js';
const interviewController = {
    // Get all interviews
    getInterviews: async (req, res) => {
        try {
            const interviews = await prisma.interview.findMany({
                include: {
                    user: true,
                    job: true,
                },
            });
            res.json({ success: true, data: interviews });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Get single interview by ID
    getInterviewById: async (req, res) => {
        try {
            const { id } = req.params;
            const interview = await prisma.interview.findUnique({
                where: { id: parseInt(id) },
                include: {
                    user: true,
                    job: true,
                },
            });
            if (!interview) {
                res.status(404).json({ success: false, error: 'Interview not found' });
                return;
            }
            res.json({ success: true, data: interview });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Get interviews by user
    getInterviewsByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const interviews = await prisma.interview.findMany({
                where: { userId: userId },
                include: {
                    user: true,
                    job: true,
                },
                orderBy: { interviewDate: 'asc' },
            });
            res.json({ success: true, data: interviews });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Get interviews by job
    getInterviewsByJob: async (req, res) => {
        try {
            const { jobId } = req.params;
            const interviews = await prisma.interview.findMany({
                where: { jobId: parseInt(jobId) },
                include: {
                    user: true,
                    job: true,
                },
            });
            res.json({ success: true, data: interviews });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Create new interview
    createInterview: async (req, res) => {
        try {
            const { userId, jobId, interviewDate, interviewType, interviewer, notes, feedback, status } = req.body;
            if (!userId || !interviewDate) {
                res.status(400).json({ success: false, error: 'User ID and interview date are required' });
                return;
            }
            const interview = await prisma.interview.create({
                data: {
                    userId: userId,
                    jobId: jobId ? parseInt(jobId) : null,
                    interviewDate: new Date(interviewDate),
                    interviewType: interviewType || null,
                    interviewer: interviewer || null,
                    notes: notes || null,
                    feedback: feedback || null,
                    status: status || 'Scheduled',
                },
            });
            res.status(201).json({ success: true, data: interview });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Update interview
    updateInterview: async (req, res) => {
        try {
            const { id } = req.params;
            const { interviewDate, interviewType, interviewer, notes, feedback, status } = req.body;
            const interview = await prisma.interview.update({
                where: { id: parseInt(id) },
                data: {
                    ...(interviewDate && { interviewDate: new Date(interviewDate) }),
                    ...(interviewType && { interviewType }),
                    ...(interviewer && { interviewer }),
                    ...(notes && { notes }),
                    ...(feedback && { feedback }),
                    ...(status && { status })
                    // updatedAt is auto-managed by Prisma @updatedAt
                },
            });
            res.json({ success: true, data: interview });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Delete interview
    deleteInterview: async (req, res) => {
        try {
            const { id } = req.params;
            const interview = await prisma.interview.delete({
                where: { id: parseInt(id) },
            });
            res.json({ success: true, message: 'Interview deleted', data: interview });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
};
export default interviewController;
