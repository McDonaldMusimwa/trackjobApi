import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import prisma from '../prisma.js';
// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'trackjob-documents';
const URL_EXPIRATION = 300; // 5 minutes
const documentController = {
    // Generate presigned URL for direct upload to S3
    getUploadUrl: async (req, res) => {
        try {
            const { fileName, fileType, documentType, userId } = req.body;
            if (!fileName || !fileType || !documentType || !userId) {
                res.status(400).json({
                    success: false,
                    error: 'fileName, fileType, documentType, and userId are required',
                });
                return;
            }
            // Validate document type
            if (!['resume', 'coverLetter'].includes(documentType)) {
                res.status(400).json({
                    success: false,
                    error: 'documentType must be either "resume" or "coverLetter"',
                });
                return;
            }
            // Generate unique file key
            const timestamp = Date.now();
            const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileKey = `${userId}/${documentType}/${timestamp}-${sanitizedFileName}`;
            // Create S3 PutObject command
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileKey,
                ContentType: fileType,
                Metadata: {
                    userId,
                    documentType,
                    originalName: fileName,
                },
            });
            // Generate presigned URL
            const uploadUrl = await getSignedUrl(s3Client, command, {
                expiresIn: URL_EXPIRATION,
            });
            // Return the upload URL and file key
            res.json({
                success: true,
                data: {
                    uploadUrl,
                    fileKey,
                    expiresIn: URL_EXPIRATION,
                },
            });
        }
        catch (error) {
            console.error('Error generating upload URL:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate upload URL',
            });
        }
    },
    // Confirm upload and save document metadata to database
    confirmUpload: async (req, res) => {
        try {
            const { userId, fileKey, fileName, fileSize, documentType } = req.body;
            if (!userId || !fileKey || !fileName || !fileSize || !documentType) {
                res.status(400).json({
                    success: false,
                    error: 'userId, fileKey, fileName, fileSize, and documentType are required',
                });
                return;
            }
            // Construct the public URL (or use CloudFront URL if configured)
            const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`;
            // Save document metadata to database
            const document = await prisma.document.create({
                data: {
                    userId,
                    name: fileName,
                    type: documentType,
                    url: fileUrl,
                    s3Key: fileKey,
                    size: parseInt(fileSize),
                },
            });
            res.status(201).json({
                success: true,
                data: document,
            });
        }
        catch (error) {
            console.error('Error confirming upload:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to confirm upload',
            });
        }
    },
    // Get all documents for a user
    getDocuments: async (req, res) => {
        try {
            const { userId } = req.params;
            const documents = await prisma.document.findMany({
                where: { userId },
                orderBy: { uploadedAt: 'desc' },
            });
            res.json({
                success: true,
                data: documents,
            });
        }
        catch (error) {
            console.error('Error fetching documents:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch documents',
            });
        }
    },
    // Delete a document
    deleteDocument: async (req, res) => {
        try {
            const { id } = req.params;
            // Get document from database
            const document = await prisma.document.findUnique({
                where: { id: parseInt(id) },
            });
            if (!document) {
                res.status(404).json({
                    success: false,
                    error: 'Document not found',
                });
                return;
            }
            // Delete from S3
            const deleteCommand = new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: document.s3Key,
            });
            await s3Client.send(deleteCommand);
            // Delete from database
            await prisma.document.delete({
                where: { id: parseInt(id) },
            });
            res.json({
                success: true,
                message: 'Document deleted successfully',
            });
        }
        catch (error) {
            console.error('Error deleting document:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete document',
            });
        }
    },
    // Generate presigned URL for downloading a document
    getDownloadUrl: async (req, res) => {
        try {
            const { id } = req.params;
            // Get document from database
            const document = await prisma.document.findUnique({
                where: { id: parseInt(id) },
            });
            if (!document) {
                res.status(404).json({
                    success: false,
                    error: 'Document not found',
                });
                return;
            }
            // Generate presigned URL for download
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: document.s3Key,
            });
            const downloadUrl = await getSignedUrl(s3Client, command, {
                expiresIn: URL_EXPIRATION,
            });
            res.json({
                success: true,
                data: {
                    downloadUrl,
                    fileName: document.name,
                    expiresIn: URL_EXPIRATION,
                },
            });
        }
        catch (error) {
            console.error('Error generating download URL:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate download URL',
            });
        }
    },
};
export default documentController;
