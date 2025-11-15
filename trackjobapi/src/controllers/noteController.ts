import { Request, Response } from 'express';
import prisma from '../prisma.js';

const noteController = {
    // Get all notes
    getNotes: async (req: Request, res: Response) => {
        try {
            const notes = await prisma.note.findMany({
                include: {
                    user: true,
                    job: true,
                },
            });
            res.json({ success: true, data: notes });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Get single note by ID
    getNoteById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const note = await prisma.note.findUnique({
                where: { id: parseInt(id) },
                include: {
                    user: true,
                    job: true,
                },
            });
            if (!note) {
                res.status(404).json({ success: false, error: 'Note not found' });
                return;
            }
            res.json({ success: true, data: note });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Get notes by user
    getNotesByUser: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const notes = await prisma.note.findMany({
                where: { userId: parseInt(userId) },
                include: {
                    user: true,
                    job: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            res.json({ success: true, data: notes });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Get notes by job
    getNotesByJob: async (req: Request, res: Response) => {
        try {
            const { jobId } = req.params;
            const notes = await prisma.note.findMany({
                where: { jobId: parseInt(jobId) },
                include: {
                    user: true,
                    job: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            res.json({ success: true, data: notes });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Create new note
    createNote: async (req: Request, res: Response) => {
        try {
            const { userId, jobId, title, content } = req.body;
            if (!userId || !title || !content) {
                res.status(400).json({ success: false, error: 'User ID, title, and content are required' });
                return;
            }
            const note = await prisma.note.create({
                data: {
                    userId: parseInt(userId),
                    jobId: jobId ? parseInt(jobId) : null,
                    title,
                    content,
                },
            });
            res.status(201).json({ success: true, data: note });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Update note
    updateNote: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            const note = await prisma.note.update({
                where: { id: parseInt(id) },
                data: {
                    ...(title && { title }),
                    ...(content && { content }),
                    updatedAt: new Date(),
                },
            });
            res.json({ success: true, data: note });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Delete note
    deleteNote: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const note = await prisma.note.delete({
                where: { id: parseInt(id) },
            });
            res.json({ success: true, message: 'Note deleted', data: note });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
};

export default noteController;
