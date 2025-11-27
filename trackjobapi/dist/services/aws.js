import AWS from 'aws-sdk';
// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
});
export async function getSignedUrl(bucketName, objectKey, expiresInSeconds) {
    const s3 = new AWS.S3();
    const params = {
        Bucket: bucketName,
        Key: objectKey,
        Expires: expiresInSeconds,
    };
    return s3.getSignedUrlPromise('getObject', params);
}
