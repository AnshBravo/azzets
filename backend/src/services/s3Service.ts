import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const requiredEnvVars = [
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET_NAME",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(
      `❌ CRITICAL CONFIGURATION FAULT: ${envVar} variable is missing!`,
    );
    process.exit(1); // Safely abort execution pipeline
  }
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface PresignedUrlParams {
  fileName: string;
  fileType: string;
  folder: "previews" | "vault";
}

export const generateUploadPresignedUrl = async ({
  fileName,
  fileType,
  folder,
}: PresignedUrlParams) => {
  const s3Key = `${folder}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: s3Key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  return { uploadUrl, s3Key };
};

export const generateDownloadPresignedUrl = async (s3Key: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: s3Key,
  });

  const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  return downloadUrl;
};
