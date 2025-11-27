import { Request, Response } from 'express';
import prisma from "../prisma.js"

const userController = {
    // Ensure user exists (find or create) - uses Clerk userId as primary key
    ensureUser: async (req: Request, res: Response) => {
        try {
            const { id, email, name, avatar } = req.body;

            if (!id || !email) {
                res.status(400).json({ 
                    success: false, 
                    error: 'Both id (Clerk user ID) and email are required' 
                });
                return;
            }

            // Try to find user by Clerk ID
            let user = await prisma.user.findUnique({
                where: { id }
            });

            // If not found, create new user with Clerk ID
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        id, // Use Clerk's user ID as primary key
                        email,
                        name: name || null,
                        avatar: avatar || null,
                        emailVerified: true
                    }
                });
            } else {
                // Update user info if exists (in case name/avatar changed)
                user = await prisma.user.update({
                    where: { id },
                    data: {
                        name: name || user.name,
                        avatar: avatar || user.avatar
                        // updatedAt is auto-managed by Prisma @updatedAt
                    }
                });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    },

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

    // Get single user by ID (Clerk user ID)
    getUserById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await prisma.user.findUnique({
                where: { id }, // String ID from Clerk
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
            const { id, email, name, avatar } = req.body;
            if (!id || !email) {
                res.status(400).json({ success: false, error: 'id (Clerk user ID) and email are required' });
                return;
            }
            const user = await prisma.user.create({
                data: {
                    id, // Clerk user ID
                    email,
                    name: name || null,
                    avatar: avatar || null,
                    emailVerified: true,
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
            const { name, avatar, emailVerified } = req.body;
            const user = await prisma.user.update({
                where: { id }, // String ID from Clerk
                data: {
                    ...(name && { name }),
                    ...(avatar && { avatar }),
                    ...(emailVerified !== undefined && { emailVerified })
                    // updatedAt is auto-managed by Prisma @updatedAt
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
                where: { id }, // String ID from Clerk
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
                where: { userId: id }, // String ID from Clerk
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
                where: { userId }, // String ID from Clerk
                update: { bio },
                create: {
                    userId, // String ID from Clerk
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