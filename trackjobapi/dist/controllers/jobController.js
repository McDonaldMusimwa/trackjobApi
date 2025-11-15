import prisma from '../prisma.js';
const jobController = {
    // Get all jobs
    getJobs: async (req, res) => {
        try {
            const jobs = await prisma.job.findMany({
                include: {
                    author: true,
                    applications: true,
                    interviews: true,
                    notes: true,
                },
            });
            res.json({ success: true, data: jobs });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Get single job by ID
    getJobById: async (req, res) => {
        try {
            const { id } = req.params;
            const job = await prisma.job.findUnique({
                where: { id: parseInt(id) },
                include: {
                    author: true,
                    applications: true,
                    interviews: true,
                    notes: true,
                },
            });
            if (!job) {
                res.status(404).json({ success: false, error: 'Job not found' });
                return;
            }
            res.json({ success: true, data: job });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Get jobs by author/user
    getJobsByAuthor: async (req, res) => {
        try {
            const { authorId } = req.params;
            const jobs = await prisma.job.findMany({
                where: { authorId: parseInt(authorId) },
                include: {
                    author: true,
                    applications: true,
                    interviews: true,
                    notes: true,
                },
            });
            res.json({ success: true, data: jobs });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Create new job
    createJob: async (req, res) => {
        try {
            const { companyname, jobtitle, joblink, status, comments, published, authorId } = req.body;
            if (!companyname || !jobtitle || !joblink) {
                res.status(400).json({ success: false, error: 'Company name, job title, and job link are required' });
                return;
            }
            const job = await prisma.job.create({
                data: {
                    companyname,
                    jobtitle,
                    joblink,
                    status: status || 'APPLIED',
                    comments: comments || null,
                    published: published || false,
                    authorId: authorId ? parseInt(authorId) : null,
                },
            });
            res.status(201).json({ success: true, data: job });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Update job
    updateJob: async (req, res) => {
        try {
            const { id } = req.params;
            const { companyname, jobtitle, joblink, status, comments, published } = req.body;
            const job = await prisma.job.update({
                where: { id: parseInt(id) },
                data: {
                    ...(companyname && { companyname }),
                    ...(jobtitle && { jobtitle }),
                    ...(joblink && { joblink }),
                    ...(status && { status }),
                    ...(comments && { comments }),
                    ...(published !== undefined && { published }),
                    updatedAt: new Date(),
                },
            });
            res.json({ success: true, data: job });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
    // Delete job
    deleteJob: async (req, res) => {
        try {
            const { id } = req.params;
            const job = await prisma.job.delete({
                where: { id: parseInt(id) },
            });
            res.json({ success: true, message: 'Job deleted', data: job });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
};
export default jobController;
