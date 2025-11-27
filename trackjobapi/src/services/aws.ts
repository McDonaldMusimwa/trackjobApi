import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'trackjob';

/**
 * Generate a presigned URL for uploading a file to S3
 */
export async function getUploadSignedUrl(
    fileKey: string,
    contentType: string,
    metadata: Record<string, string>,
    expiresInSeconds: number = 300
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        ContentType: contentType,
        Metadata: metadata,
    });

    return awsGetSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generate a presigned URL for downloading a file from S3
 */
export async function getDownloadSignedUrl(
    fileKey: string,
    expiresInSeconds: number = 300
): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
    });

    return awsGetSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
    });

    await s3Client.send(command);
}

/**
 * Get the public URL for a file in S3
 */
export function getPublicUrl(fileKey: string): string {
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`;
}