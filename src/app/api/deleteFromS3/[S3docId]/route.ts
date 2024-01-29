import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  S3Client
} from '@aws-sdk/client-s3'

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
async function deleteFileFromS3(
  projectOrFileId: string
): Promise<DeleteObjectCommandOutput> {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: projectOrFileId
  }

  const command = new DeleteObjectCommand(params)
  const data = await s3Client.send(command)

  return data
}

export async function DELETE(
  _req: Request,
  { params: { S3docId } }: { params: { S3docId: string } }
) {
  if (!S3docId) {
    throw new Error('ID of the document or the folder of documents is required')
  }

  try {
    const { DeleteMarker: docDeleted } = await deleteFileFromS3(S3docId)

    return new Response(JSON.stringify({ docDeleted }), { status: 200 })
  } catch (error: any) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
}
