import { Request, Response } from 'express';
import prisma from "../prisma.js"

const userController = {
    // Get all users
    getUsers: async (req: Request, res: Response) => {
        try {
            const users = await prisma.user.findMany({
                include: {
                    profile: true,
                    jobs: true,
                    applications: true,
                    interviews: true,
                    notes: true,
                },
            });
            console.log(users);
            res.json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Get single user by ID
    getUserById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id: parseInt(id) },
                include: {
                    profile: true,
                    jobs: true,
                    applications: true,
                    interviews: true,
                    notes: true,
                },
            });
            if (!user) {
                res.status(404).json({ success: false, error: 'User not found' });
                return;
            }
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Create new user
    createUser: async (req: Request, res: Response) => {
        try {
            const { email, name, password, provider, providerId, avatar } = req.body;
            if (!email) {
                res.status(400).json({ success: false, error: 'Email is required' });
                return;
            }
            const user = await prisma.user.create({
                data: {
                    email,
                    name: name || null,
                    password: password || null,
                    provider: provider || null,
                    providerId: providerId || null,
                    avatar: avatar || null,
                },
            });
            res.status(201).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Update user
    updateUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, password, avatar, emailVerified } = req.body;
            const user = await prisma.user.update({
                where: { id: parseInt(id) },
                data: {
                    ...(name && { name }),
                    ...(password && { password }),
                    ...(avatar && { avatar }),
                    ...(emailVerified !== undefined && { emailVerified }),
                    updatedAt: new Date(),
                },
            });
            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Delete user
    deleteUser: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await prisma.user.delete({
                where: { id: parseInt(id) },
            });
            res.json({ success: true, message: 'User deleted', data: user });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Get user profile
    getUserProfile: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const profile = await prisma.profile.findUnique({
                where: { userId: parseInt(id) },
                include: { user: true },
            });
            if (!profile) {
                res.status(404).json({ success: false, error: 'Profile not found' });
                return;
            }
            res.json({ success: true, data: profile });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    // Create or update user profile
    createOrUpdateUserProfile: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { bio } = req.body;
            const profile = await prisma.profile.upsert({
                where: { userId: parseInt(userId) },
                update: { bio },
                create: {
                    userId: parseInt(userId),
                    bio: bio || null,
                },
            });
            res.status(201).json({ success: true, data: profile });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
};

export default userController;