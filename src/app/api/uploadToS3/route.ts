import { APP_LOGO } from '@/data/constants'
import { createSlug } from '@/lib/utils'
import type { imgsProps, uploadFileToS3Props } from '@/types'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
async function uploadFileToS3({
  file,
  multiple,
  fileObject,
  fullname,
  projectId
}: uploadFileToS3Props): Promise<string> {
  const { name, type } = fileObject
  const key = `${(fullname ? createSlug(fullname) : '') + name}-SHMS-${projectId}`

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

export async function POST(request: any) {
  try {
    const formData = await request.formData()
    const fullname: string = formData.get('fullname')
    const multiple: boolean = JSON.parse(formData.get('multiple') ?? 'false')
    const projectId: string = formData.get('projectId') ?? randomUUID()

    // Extract files dynamically based on their dynamic names
    const files: File[] = []
    let index = 0
    while (formData.has(`file[${index}]`)) {
      files.push(formData.get(`file[${index}]`))
      files.push(formData.get('caseStudyfile'))
      index++
    }

    if (!files || (files.length === 0 && multiple)) {
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
        fullname: fullname ?? 'user-document',
        projectId
      })

      const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`

      return new Response(JSON.stringify({ shms_id: projectId, shms_doc: fileUrl }), {
        status: 200
      })
    } else {
      const fileURLs: string[] = []
      const fileKeys: string[] = []

      for (const file of files) {
        const key = await uploadFileToS3({
          file: Buffer.from(await file.arrayBuffer()),
          multiple,
          fileObject: file,
          projectId
        })

        const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/projects/${projectId}/${key}`

        fileURLs.push(fileUrl)
        fileKeys.push(key)
      }

      return new Response(
        JSON.stringify({
          shms_project_id: projectId,
          shms_project_images: fileKeys.map((fileKey, index) => {
            return {
              imgDisplayName: fileKey,
              imgDisplayPath: fileURLs[index] ?? APP_LOGO
            } satisfies imgsProps
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
