import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import type { DocImgsProps, uploadFileToS3Props } from '@/types'
import { APP_LOGO } from '@/data/constants'

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
async function uploadFileToS3({
  file,
  multiple,
  fileObject,
  fullname,
  projectId
}: uploadFileToS3Props): Promise<string> {
  const { name, type } = fileObject
  const key = `${randomUUID()}-${fullname}-${name}`
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: multiple ? `projects/${projectId ? `${projectId}/${key}` : key}` : key,
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
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

export async function POST(request: any) {
  try {
    const formData = await request.formData()
    const fullname: string = formData.get('fullname')
    const multiple: boolean = JSON.parse(formData.get('multiple') ?? 'false')
    const projectId: string = randomUUID()

    // Extract files dynamically based on their dynamic names
    const files: File[] = []
    let index = 0
    while (formData.has(`file[${index}]`)) {
      files.push(formData.get(`file[${index}]`))
      index++
    }

    if (!files || files.length === 0) {
      return new Response('No file found', { status: 400 })
    }

    // if single file
    if (!multiple) {
      const file: File = files[0] ?? formData.get('file')
      if (!file) return new Response('No file found', { status: 400 })

      const key = await uploadFileToS3({
        file: Buffer.from(await file.arrayBuffer()),
        multiple,
        fileObject: file,
        fullname: fullname ?? 'user-document'
      })

      const fileUrl =
        `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${
          multiple ? `projects/${projectId}/${key}` : key
        }` ??
        (await getSignedFileUrl(
          multiple ? `projects/${projectId}/${key}` : key,
          AWS_BUCKET_NAME!,
          3600
        ))

      return new Response(fileUrl, { status: 200 })
    } else {
      const fileURLs: string[] = []
      const fileKeys: string[] = []

      for (const file of files) {
        const key = await uploadFileToS3({
          file: Buffer.from(await file.arrayBuffer()),
          multiple,
          fileObject: file,
          fullname: fullname ?? 'user-document',
          projectId
        })

        const fileUrl =
          `https://${
            multiple ? `projects/${projectId}` + AWS_BUCKET_NAME : AWS_BUCKET_NAME
          }.s3.${AWS_REGION}.amazonaws.com/${key}` ??
          (await getSignedFileUrl(
            key,
            multiple ? `projects/${projectId}` + AWS_BUCKET_NAME : AWS_BUCKET_NAME!,
            3600
          ))

        fileURLs.push(fileUrl)
        fileKeys.push(key)
      }

      return new Response(
        JSON.stringify({
          shms_project_id: projectId,
          shms_project_images: fileKeys.map((fileKey, index) => {
            return {
              docImgDisplayName: fileKey,
              docImgDisplayPath: fileURLs[index] ?? APP_LOGO
            } satisfies DocImgsProps
          })
        }),
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
}
