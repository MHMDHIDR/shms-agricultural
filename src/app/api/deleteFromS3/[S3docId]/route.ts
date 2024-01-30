import {
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
 * Uploads The User document to S3
 * @param file - The file to be uploaded
 * @param fileObject - The file object
 * @param fullname  - The fullname of the user
 * @returns {Promise<string>} - The key of the file in S3
 */
async function deleteFilesFromS3(projectOrFileId: string): Promise<DeletedObject[]> {
  const listCommand = new ListObjectsV2Command({
    Bucket: AWS_BUCKET_NAME,
    Prefix: `projects/${projectOrFileId}`
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

export async function DELETE(
  _req: Request,
  { params: { S3docId } }: { params: { S3docId: string } }
) {
  if (!S3docId) {
    throw new Error('ID of the document or the folder of documents is required')
  }

  try {
    const dataAfterDelete = await deleteFilesFromS3(S3docId)
    //  map in dataAfterDelete and check if all DeleteMarker are true, if all are true then return true
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
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
}
