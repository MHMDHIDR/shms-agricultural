import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeletedObject,
  ListObjectsV2Command,
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
 * Deletes a Objects or a folder from S3
 * @param file - The file to be uploaded
 * @param fileObject - The file object
 * @param fullname  - The fullname of the user
 * @returns {Promise<string>} - The key of the file in S3
 */
async function deleteFilesFromS3(projectOrFileId: string): Promise<DeletedObject[]> {
  const listCommand = new ListObjectsV2Command({
    Bucket: AWS_BUCKET_NAME,
    // replace only the first - symbol in project-this-is-the-id to project/this-is-the-id
    Prefix: projectOrFileId.replace('-', '/')
  })

  let list = await s3Client.send(listCommand)
  let deleted: Array<DeletedObject> = []

  if (list.KeyCount && list.Contents) {
    // delete the files
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
      Delete: {
        Objects: list.Contents.map(item => ({ Key: item.Key })),
        Quiet: false
      }
    })
    let { Errors, Deleted } = await s3Client.send(deleteCommand)

    if (Errors) {
      Errors.map(error =>
        console.error(`${error.Key} could not be deleted - ${error.Code}`)
      )
    }

    if (Deleted) {
      deleted.push(...Deleted)
    }
  }

  return deleted
}

/**
 * Deletes a document or a file from S3
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
    throw new Error('ID of the document or the folder is required!')
  }

  if (S3docId.includes('projects')) {
    try {
      const dataAfterDelete = await deleteFilesFromS3(S3docId)

      dataAfterDelete.map(({ DeleteMarker }) => {
        if (!DeleteMarker) {
          return new Response(
            JSON.stringify({
              docDeleted: false,
              message: 'حدث خطأ أثناء حذف صور المشروع! حاول مرة أخرى لاحقاً'
            }),
            { status: 400 }
          )
        }
      })

      return new Response(JSON.stringify({ docDeleted: true }), { status: 200 })
    } catch (error: any) {
      return new Response(error.message, { status: 500 })
    }
  } else {
    try {
      const { DeleteMarker: docDeleted } = await deleteFileFromS3(S3docId)

      return new Response(JSON.stringify({ docDeleted }), { status: 200 })
    } catch (error: any) {
      console.error(error)
      return new Response(error.message, { status: 500 })
    }
  }
}
