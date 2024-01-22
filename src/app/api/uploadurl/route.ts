import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'

const { AWS_ACCESS_ID, AWS_SECRET, AWS_BUCKET_NAME, AWS_REGION } = process.env

const s3ClientConfig = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_ID!,
    secretAccessKey: AWS_SECRET!
  }
}

const s3Client = new S3Client(s3ClientConfig)

/**
 * Uploads The User document to S3
 * @param file - The file to be uploaded
 * @param fileObject - The file object
 * @param fullname  - The fullname of the user
 * @returns {Promise<string>} - The key of the file in S3
 */
async function uploadFileToS3(
  file: Buffer,
  fileObject: File,
  fullname: string
): Promise<string> {
  const { name, type } = fileObject
  // a Unique key (name) for the file
  const key = `${randomUUID()}-${fullname}-${name}`
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: type
  }

  const command = new PutObjectCommand(params)
  await s3Client.send(command)

  return key
}

/*
 * Generates a signed URL for the file
 * @param key - The key of the file in S3
 * @param bucket - The bucket name
 * @param expiresIn - The time in seconds for the signed URL to expire
 * @returns {Promise<string>} - The signed URL
 */
async function getSignedFileUrl(key: string, bucket: string, expiresIn: number) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn })
  return url
}

export async function POST(request: any) {
  try {
    const formData = await request.formData()
    const file: File = formData.get('file')
    const fullname: string = formData.get('fullname')

    if (!file) {
      return new Response('No file found', { status: 400 })
    }

    const key = await uploadFileToS3(
      Buffer.from(await file.arrayBuffer()),
      file,
      fullname ?? 'unknown'
    )
    const fileUrl = await getSignedFileUrl(key, AWS_BUCKET_NAME!, 3600)

    return new Response(fileUrl, { status: 200 })
  } catch (error: any) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
}
