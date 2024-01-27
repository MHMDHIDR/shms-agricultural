import { NextApiRequest } from 'next'
import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type UserProps = {
  shms_id: string
  shms_fullname: string
  fullname?: string
  shms_nationality: string
  shms_date_of_birth: Date
  shms_email: string
  shms_password?: string
  shms_phone?: string
  shms_address?: string
  shms_doc?: string
  shms_user_stocks?: number
  shms_created_at?: string
  shms_user_account_type?: 'admin' | 'user'
  shms_user_account_status?: 'active' | 'block' | 'pending'
  shms_user_reset_token?: string
  shms_user_reset_token_expires?: number
  // When user action happens
  message?: string
  // When user is logged in, this is set to 1
  loggedIn?: number
  // When user is registered, this is set to 1
  userAdded?: number
  // When user is activated, this is set to 1
  userActivated?: number
  // When user forgot password, this is set to 1
  forgotPassSent?: number
  // When user reset password, this is set to 1
  newPassSet?: number
  // When user changes their email, this is set to 1
  resetEmail?: number
}

export type UserLoggedInProps =
  | (Session & {
      token?: JWT & {
        user: UserProps
      }
    })
  | null

export type FileUploadProps = {
  file: File[]
  fileURLs: string[]
  setFileURLs(fileURLs: string[]): void
  onFileAdd?: (e: { target: { files: any } }) => void
  onFileRemove(fileUrl: string, fileName: string): void
}

export type FileUploadComponentProps = {
  data: {
    foodId?: string
    imgName: string
    defaultImg: DocImgsProps[]
  }
  ignoreRequired?: boolean
  ignoreDelete?: boolean | undefined
  id?: string
}

export type fileRequestProps = NextApiRequest & {
  key: string
  type: string
}

export type DocImgsProps = {
  docImgDisplayName: string
  docImgDisplayPath: string
}

export type uploadurlDataProps = {
  data: {
    map(arg0: ({ fields, url }: any, idx: number) => Promise<void>): unknown
    fields: {
      'Content-Type': string
      'PolicyX-Amz-Algorithm': string
      'X-Amz-Credential': string
      'X-Amz-Date': string
      'X-Amz-Signature': string
      bucket: string
      key: string
    }
    url: string
  }[]
}

// User Email
export type customEmailProps = (props: {
  title?: string
  msg?: string
  buttonLink?: string
  buttonLabel?: string
  logoSrc?: string
}) => string

export type emailProps = {
  emailOrPhone: string
  address: string
  message: string
  mailSent?: number
}

export type MenuItemsProps = {
  title: string
  href: string
  description: string
}[]

export type ProjectProps = {
  shms_id: string
  shms_project_images: string
  shms_project_name: string
  shms_project_location: string
  shms_project_start_date: Date
  shms_project_end_date: Date
  shms_project_invest_date: Date
  shms_project_stock_price: number
  shms_project_stock_profits: number
  shms_project_description: string
  shms_project_status: 'active' | 'pending'
  // When project is added, this is set to 1
  projectAdded?: number
  // When project is updated, this is set to 1
  projectUpdated?: number
  // When project is deleted, this is set to 1
  projectDeleted?: number
  // When a project action happens
  message?: string
}
